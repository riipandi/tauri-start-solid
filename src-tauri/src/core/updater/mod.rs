pub mod state;

use state::UpdateState;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};
use tauri_plugin_updater::UpdaterExt;
use url::Url;

use crate::core::settings::{UpdateChannel, load_settings};

const S3_PUBLIC_URL: &str = env!("S3_PUBLIC_URL");
const S3_PATH_PREFIX: &str = env!("S3_PATH_PREFIX");

fn get_update_endpoint(channel: &UpdateChannel) -> String {
    let channel_name = match channel {
        UpdateChannel::Stable => "stable",
        UpdateChannel::Canary => "canary",
    };

    // Sanitize S3_PATH_PREFIX (handle "null", empty, leading/trailing slashes)
    let prefix = if S3_PATH_PREFIX.is_empty() || S3_PATH_PREFIX == "null" {
        String::new()
    } else {
        format!("{}/", S3_PATH_PREFIX.trim_matches('/'))
    };

    // Build URL: {base}/{prefix}{channel}/update.json
    // Always add "/" after base, then optionally prefix
    let base = S3_PUBLIC_URL.trim_end_matches('/');
    if prefix.is_empty() {
        format!("{}/{}/update.json", base, channel_name)
    } else {
        format!("{}/{}/{}/update.json", base, prefix.trim_end_matches('/'), channel_name)
    }
}

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateInfo {
    pub version: String,
    pub date: String,
    pub notes: String,
    pub body: String,
}

#[derive(Clone, serde::Serialize)]
#[serde(tag = "event", content = "data")]
pub enum DownloadEvent {
    #[serde(rename_all = "camelCase")]
    Started {
        content_length: Option<u64>,
    },
    #[serde(rename_all = "camelCase")]
    Progress {
        chunk_length: usize,
        content_length: Option<u64>,
    },
    Finished,
}

#[derive(Clone)]
pub struct UpdateManager(Arc<Mutex<UpdateState>>);

impl UpdateManager {
    pub fn new() -> Self {
        Self(Arc::new(Mutex::new(UpdateState::default())))
    }

    pub fn get_state(&self) -> UpdateState {
        self.0.lock().unwrap().clone()
    }

    pub fn should_check_for_updates(&self) -> bool {
        self.0.lock().unwrap().should_check_for_updates()
    }

    pub async fn check_for_updates<R: tauri::Runtime>(&self, app: AppHandle<R>) -> Result<Option<UpdateInfo>, String> {
        let settings = load_settings(&app).map_err(|e| format!("Failed to load settings: {}", e))?;

        let endpoint = get_update_endpoint(&settings.update.channel);

        log::info!("Checking for updates from: {}", endpoint);

        let endpoint_url = Url::parse(&endpoint).map_err(|e| format!("Invalid endpoint URL: {}", e))?;

        let update = app
            .updater_builder()
            .endpoints(vec![endpoint_url])
            .map_err(|e| format!("Failed to set endpoint: {}", e))?
            .build()
            .map_err(|e| format!("Failed to build updater: {}", e))?
            .check()
            .await
            .map_err(|e| format!("Failed to check for updates: {}", e))?;

        if let Some(update) = update {
            let version = update.version.clone();
            let date_str = update.date.as_ref().map(|d| d.to_string()).unwrap_or_default();
            let body = update.body.clone().unwrap_or_default();

            {
                let mut state = self.0.lock().unwrap();
                state.update_check_time();
                if let Some(date) = update.date {
                    state.set_pending_update(
                        version.clone(),
                        chrono::DateTime::from_timestamp(date.unix_timestamp(), 0)
                            .unwrap_or_else(|| chrono::Utc::now()),
                        body.clone(),
                    );
                }
            }

            let update_info = UpdateInfo {
                version: version.clone(),
                date: date_str,
                notes: body.clone(),
                body,
            };

            Ok(Some(update_info))
        } else {
            let mut state = self.0.lock().unwrap();
            state.update_check_time();
            Ok(None)
        }
    }

    pub async fn download_and_install<R: tauri::Runtime>(
        &self,
        app: AppHandle<R>,
        on_event: impl Fn(DownloadEvent) + Send + Sync + 'static,
    ) -> Result<(), String> {
        let settings = load_settings(&app).map_err(|e| format!("Failed to load settings: {}", e))?;

        let endpoint = get_update_endpoint(&settings.update.channel);

        let endpoint_url = Url::parse(&endpoint).map_err(|e| format!("Invalid endpoint URL: {}", e))?;

        let update = app
            .updater_builder()
            .endpoints(vec![endpoint_url])
            .map_err(|e| format!("Failed to set endpoint: {}", e))?
            .build()
            .map_err(|e| format!("Failed to build updater: {}", e))?
            .check()
            .await
            .map_err(|e| format!("Failed to check for updates: {}", e))?;

        if let Some(update) = update {
            let mut downloaded = 0u64;
            let mut content_length = None;

            update
                .download_and_install(
                    |chunk_length, content_length_| {
                        if content_length.is_none() {
                            on_event(DownloadEvent::Started {
                                content_length: content_length_,
                            });
                            content_length = content_length_;
                        }
                        downloaded += chunk_length as u64;
                        on_event(DownloadEvent::Progress {
                            chunk_length,
                            content_length,
                        });
                    },
                    || {
                        on_event(DownloadEvent::Finished);
                    },
                )
                .await
                .map_err(|e| format!("Failed to download and install: {}", e))?;

            {
                let mut state = self.0.lock().unwrap();
                state.mark_downloaded();
            }

            Ok(())
        } else {
            Err("No update available".to_string())
        }
    }

    pub async fn install_pending<R: tauri::Runtime>(&self, app: AppHandle<R>) -> Result<(), String> {
        {
            let state = self.0.lock().unwrap();
            if !state.has_pending_update() {
                return Err("No pending update".to_string());
            }
        }

        let settings = load_settings(&app).map_err(|e| format!("Failed to load settings: {}", e))?;

        let endpoint = get_update_endpoint(&settings.update.channel);

        let endpoint_url = Url::parse(&endpoint).map_err(|e| format!("Invalid endpoint URL: {}", e))?;

        let update = app
            .updater_builder()
            .endpoints(vec![endpoint_url])
            .map_err(|e| format!("Failed to set endpoint: {}", e))?
            .build()
            .map_err(|e| format!("Failed to build updater: {}", e))?
            .check()
            .await
            .map_err(|e| format!("Failed to check for updates: {}", e))?;

        if let Some(update) = update {
            update
                .download_and_install(|_, _| {}, || {})
                .await
                .map_err(|e| format!("Failed to install: {}", e))?;

            Ok(())
        } else {
            Err("No update available".to_string())
        }
    }
}

impl Default for UpdateManager {
    fn default() -> Self {
        Self::new()
    }
}

pub async fn check_and_notify<R: tauri::Runtime>(app: AppHandle<R>, manager: UpdateManager) -> Result<(), String> {
    let settings = load_settings(&app).map_err(|e| format!("Failed to load settings: {}", e))?;

    if settings.update.mode == crate::core::settings::UpdateMode::Manual {
        log::info!("Update mode is manual, skipping automatic check");
        return Ok(());
    }

    if !manager.should_check_for_updates() {
        log::info!("Update check not needed yet (less than 24 hours since last check)");
        return Ok(());
    }

    log::info!("Starting automatic update check");

    match manager.check_for_updates(app.clone()).await {
        Ok(Some(update_info)) => {
            log::info!("Update found: {}", update_info.version);

            if settings.update.auto_download {
                log::info!("Auto-download enabled, starting download");

                let manager_clone = manager.clone();
                let app_clone = app.clone();
                let app_clone2 = app_clone.clone();
                tauri::async_runtime::spawn(async move {
                    if let Err(e) = manager_clone
                        .download_and_install(app_clone.clone(), move |event| {
                            let _ = app_clone.emit("updater://download-progress", event);
                        })
                        .await
                    {
                        log::error!("Auto-download failed: {}", e);
                        let _ = app_clone2.emit("updater://error", e);
                    } else {
                        let _ = app_clone2.emit("updater://ready-to-install", ());
                    }
                });
            } else {
                let _ = app.emit("updater://update-available", update_info);
            }
        }
        Ok(None) => {
            log::info!("No update available");
        }
        Err(e) => {
            log::error!("Failed to check for updates: {}", e);
        }
    }

    Ok(())
}

pub async fn start_update_scheduler<R: tauri::Runtime>(app: AppHandle<R>, manager: UpdateManager) {
    let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(3600));

    loop {
        interval.tick().await;

        if let Err(e) = check_and_notify(app.clone(), manager.clone()).await {
            log::error!("Update check failed: {}", e);
        }
    }
}
