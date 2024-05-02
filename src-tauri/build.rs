fn main() {
    // Read value from `.env` file (compile time)
    dotenv_build::output(dotenv_build::Config::default()).expect("Error reading from envars file at compile time");
    tauri_build::build()
}
