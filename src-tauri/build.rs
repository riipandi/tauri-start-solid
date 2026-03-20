fn main() {
    // Configure dotenv-build to use the selected environment file
    let config = dotenv_build::Config {
        filename: std::path::Path::new(".env"), // Determine which .env file to load based on build mode
        recursive_search: true,                 // Should search for the file recursively upwards
        fail_if_missing_dotenv: true,           // Fail if the environment file is missing
    };

    // Load environment variables from the selected file
    dotenv_build::output(config).expect("Error reading from environment file at compile time");

    // Continue with Tauri build
    tauri_build::build()
}
