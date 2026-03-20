use tauri_plugin_log::{Target, TargetKind, TimezoneStrategy};

/// Setup logging configuration for the application
pub fn setup_plugin_log() -> tauri_plugin_log::Builder {
    let app_name = env!("CARGO_PKG_NAME").replace(" ", "-").to_lowercase();
    let suffix = if cfg!(debug_assertions) { "-debug" } else { "" };
    let file_name = format!("{}{}", app_name, suffix);

    // Some features need to get detailed logs, so we use Debug level for them
    let log_level_essential = if cfg!(debug_assertions) {
        log::LevelFilter::Debug
    } else {
        log::LevelFilter::Info
    };

    tauri_plugin_log::Builder::new()
        .level(log::LevelFilter::Debug)
        .level_for("tauri", log::LevelFilter::Error)
        .level_for("wry", log::LevelFilter::Off)
        .level_for("tao", log::LevelFilter::Off)
        .level_for("hyper", log::LevelFilter::Off)
        .level_for("reqwest", log::LevelFilter::Error)
        .level_for("tauri_plugin_updater", log_level_essential)
        .timezone_strategy(TimezoneStrategy::UseLocal)
        .format(|out, message, record| {
            let now = chrono::Local::now();
            let level = record.level();
            let padding = " ".repeat(6 - level.to_string().len());
            out.finish(format_args!(
                "[{}][{}]{}{}",
                now.format("%Y-%m-%d %H:%M:%S"),
                level,
                padding,
                message
            ))
        })
        .targets([Target::new(TargetKind::Stdout).filter(|meta| meta.level() != log::Level::Trace)])
        .target(tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
            file_name: Some(file_name),
        }))
}
