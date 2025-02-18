mod cmd;
mod config;
mod menu;
mod store;
mod theme;
mod tray;
mod utils;
mod window;

use chrono::Local;
use tauri::RunEvent;
use tauri_plugin_log::{Target, TargetKind, TimezoneStrategy};
use tauri_specta::collect_commands;
use tauri_specta::Builder as SpectaBuilder;

use cmd::example::{goodbye_world, greet};
use config::setup_config_store;
use menu::setup_menu;
use theme::{get_theme, set_theme};
use tray::setup_tray;
use window::{create_main_window, create_settings_window};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let specta_builder = SpectaBuilder::<tauri::Wry>::new()
        .commands(collect_commands![
            get_theme::<tauri::Wry>,
            set_theme::<tauri::Wry>,
            greet,
            goodbye_world
        ])
        .constant("APP_NAME", "Tauri App");

    #[cfg(debug_assertions)]
    {
        let export_opts = specta_typescript::Typescript::default()
            .formatter(specta_typescript::formatter::biome)
            .header("/* eslint-disable */");

        specta_builder
            .export(export_opts, "../src/libs/bindings.ts")
            .expect("Failed to export typescript bindings");
    }

    let builder = tauri::Builder::default();
    let tauri_ctx = tauri::generate_context!();

    // Setup the logger (https://tauri.app/plugin/logging)
    let plugin_log = tauri_plugin_log::Builder::new()
        .level(log::LevelFilter::Debug)
        .level_for("tauri", log::LevelFilter::Error)
        .level_for("wry", log::LevelFilter::Off)
        .level_for("tao", log::LevelFilter::Off)
        .level_for("hyper", log::LevelFilter::Off)
        .level_for("reqwest", log::LevelFilter::Error)
        .level_for("tauri_plugin_updater", log::LevelFilter::Debug)
        .timezone_strategy(TimezoneStrategy::UseLocal)
        .format(|out, message, record| {
            let now = Local::now();
            let level = record.level().to_string();
            let padding = " ".repeat(6 - level.len());
            out.finish(format_args!(
                "[{}][{}][{}]{}{}",
                now.format("%Y-%m-%d"),
                now.format("%H:%M:%S"),
                level,
                padding,
                message
            ))
        })
        .targets([Target::new(TargetKind::Stdout).filter(|meta| meta.level() != log::Level::Trace)]);

    // Register Tauri plugins
    let builder = builder
        .plugin(plugin_log.build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build());

    // Setup the application properties
    let builder = builder.setup(move |app| {
        specta_builder.mount_events(app);

        setup_config_store(app)?;
        create_main_window(app)?;
        create_settings_window(app)?;
        setup_tray(app)?;
        setup_menu(app)?;

        #[cfg(target_os = "windows")]
        {
            use config::{AppConfig, CONFIG_KEY};
            use std::sync::Mutex;
            use store::KVStore;

            let state = app.state::<Mutex<KVStore<String, AppConfig>>>();
            if let Ok(store) = state.lock() {
                if let Ok(Some(config)) = store.get(&CONFIG_KEY.to_string()) {
                    let theme = config.theme;
                    for window in &mut app.webview_windows() {
                        match theme {
                            theme::Theme::System => window.theme = None,
                            theme::Theme::Light => window.theme = Some(tauri::Theme::Light),
                            theme::Theme::Dark => window.theme = Some(tauri::Theme::Dark),
                        }
                    }
                }
            }
        }

        // Check for updates automatically
        let handle = app.handle().clone();
        tauri::async_runtime::spawn(async move {
            match utils::update(handle).await {
                Ok(_) => log::info!("Automatic update check completed successfully"),
                Err(e) => log::error!("Automatic update check failed: {}", e),
            }
        });

        Ok(())
    });

    // Finally, build and run the application
    builder
        .invoke_handler(tauri::generate_handler![get_theme, set_theme, greet, goodbye_world])
        .build(tauri_ctx)
        .expect("error while building tauri application")
        .run(|app_handle, event| match event {
            RunEvent::Ready { .. } => {
                if let Ok(theme) = get_theme(app_handle.clone()) {
                    if let Err(err) = set_theme(app_handle.clone(), theme) {
                        eprintln!("Failed to set theme: {}", err);
                    }
                }
            }

            // Prevent the app from exiting unless the user explicitly closes it
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}
