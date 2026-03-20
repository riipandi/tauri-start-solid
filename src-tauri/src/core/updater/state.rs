use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateState {
    pub last_check: Option<DateTime<Utc>>,
    pub pending_version: Option<String>,
    pub pending_date: Option<DateTime<Utc>>,
    pub pending_notes: Option<String>,
    pub downloaded: bool,
}

impl Default for UpdateState {
    fn default() -> Self {
        Self {
            last_check: None,
            pending_version: None,
            pending_date: None,
            pending_notes: None,
            downloaded: false,
        }
    }
}

impl UpdateState {
    pub fn should_check_for_updates(&self) -> bool {
        if let Some(last_check) = self.last_check {
            let now = Utc::now();
            let duration = now.signed_duration_since(last_check);
            duration.num_hours() >= 24
        } else {
            true
        }
    }

    pub fn update_check_time(&mut self) {
        self.last_check = Some(Utc::now());
    }

    pub fn set_pending_update(&mut self, version: String, date: DateTime<Utc>, notes: String) {
        self.pending_version = Some(version);
        self.pending_date = Some(date);
        self.pending_notes = Some(notes);
        self.downloaded = false;
    }

    pub fn mark_downloaded(&mut self) {
        self.downloaded = true;
    }

    pub fn has_pending_update(&self) -> bool {
        self.pending_version.is_some()
    }
}
