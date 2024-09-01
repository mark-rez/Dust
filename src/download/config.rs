use std::{fs, path::Path};
use serde::Deserialize;

/// Represents the configuration settings loaded from a `config.json` file.
#[derive(Deserialize)]
pub struct Config {
    /// The path where files should be saved.
    path: String,
}

impl Config {
    /// Loads the default configuration from the `config.json` file.
    ///
    /// This method reads the configuration file, deserializes its content into a `Config` instance,
    /// and performs basic validation to ensure the specified path exists.
    ///
    /// # Panics
    ///
    /// This method will panic if:
    /// - The `config.json` file cannot be read.
    /// - The content of `config.json` cannot be deserialized into a `Config` instance.
    /// - The path specified in the configuration does not exist.
    ///
    /// # Returns
    ///
    /// Returns the `Config` instance if all operations are successful.
    pub fn default() -> Self {
        // Read the content of the `config.json` file into a string.
        let file_content = fs::read_to_string("config.json").unwrap();

        // Deserialize the JSON content into a `Config` instance.
        let config: Config = serde_json::from_str(&file_content).unwrap();

        // Validate that the specified path exists.
        if !Path::new(&config.path).exists() {
            panic!("Invalid path in `config.json`");
        }

        // Return the `Config` instance.
        config
    }

    /// Returns the path specified in the configuration.
    ///
    /// # Returns
    ///
    /// Returns a reference to the `path` string from the configuration.
    pub fn path(&self) -> &str {
        &self.path
    }
}
