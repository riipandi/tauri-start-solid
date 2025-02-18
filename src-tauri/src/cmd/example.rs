use serde::Serialize;

#[tauri::command]
#[specta::specta]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
#[specta::specta]
pub fn goodbye_world() -> impl Serialize + specta::Type {
    "Goodbye world :("
}
