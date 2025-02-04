use tauri::{Runtime, WebviewWindow};

/// Force reloads the given window by navigating to its current URL
///
/// # Arguments
/// * `window` - Mutable reference to the window that needs to be reloaded
///
/// # Returns
/// * `Result<(), String>` - Success or error message
pub fn force_reload<R: Runtime>(window: &mut WebviewWindow<R>) -> Result<(), String> {
    let current_url = window.url().map_err(|e| e.to_string())?;
    println!("Force reloading page: {}", current_url.as_str());
    window.navigate(current_url).map_err(|e| e.to_string())
}
