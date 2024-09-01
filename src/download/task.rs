use reqwest::{header::CONTENT_LENGTH, Client, Url};
use tokio::{fs::File, io::AsyncWriteExt};
use tokio_stream::StreamExt;

use crate::error::Error;
use super::config::Config;

/// Represents a download task, which includes a URL to download from and a file path to save to.
#[derive(Debug)]
pub struct Task {
    url: Url,
    filename: String,
}

impl Task {
    /// Creates a new `Task` instance with the specified download URL and output file path.
    ///
    /// # Arguments
    ///
    /// * `download_url` - The URL from which to download the file.
    /// * `file_path` - The path where the downloaded file will be saved.
    ///
    /// # Returns
    ///
    /// Returns `Ok(Task)` if the URL and file path are valid, or an `Error` if they are not.
    pub fn new(download_url: &Url, file_path: &str) -> Result<Self, Error> {
        Ok(Task {
            url: download_url.clone(),
            filename: String::from(file_path),
        })
    }

    /// Downloads the file from the URL and saves it to the specified output path.
    ///
    /// This method streams the file content in chunks and writes each chunk to the file asynchronously.
    ///
    /// # Returns
    ///
    /// Returns `Ok(())` if the download and file writing are successful, or an `Error` if any step fails.
    pub async fn download(&self) -> Result<(), Error> {
        // Create a new HTTP client.
        let client = Client::new();
        
        // Send a GET request and obtain a stream of bytes.
        let mut stream = client.get(self.url.as_str()).send().await?.bytes_stream();

        // Prepare the file path for saving the downloaded content.
        let mut path = Config::default().path().to_string();
        path.push_str(&self.filename);
        
        // Create or truncate the file at the specified path.
        let mut file = File::create(path).await?;

        // Stream the bytes from the response and write each chunk to the file.
        while let Some(chunk) = stream.next().await {
            let chunk = chunk?;
            file.write_all(&chunk).await?;
        }

        // Ensure all data is written to the file.
        file.flush().await?;
        Ok(())
    }

    /// Retrieves the content length of the file from the server's response headers.
    ///
    /// This method sends a HEAD request to the URL to get metadata about the file without downloading it.
    ///
    /// # Returns
    ///
    /// Returns `Some(u64)` with the content length if available and parsable, or `None` if not.
    pub async fn content_length(&self) -> Option<u64> {
        if let Ok(resp) = Client::new().head(self.url.as_str()).send().await {
            return resp
                .headers()
                .get(CONTENT_LENGTH)
                .and_then(|header_value| header_value.to_str().ok()) // Convert header value to a string slice.
                .and_then(|header_str| u64::from_str_radix(header_str, 10).ok()); // Parse the string to `u64`.
        }
        None
    }

    /// Returns the download URL.
    ///
    /// # Returns
    ///
    /// Returns a reference to the `Url` used for downloading the file.
    pub fn url(&self) -> &Url {
        &self.url
    }

    /// Returns the output file path.
    ///
    /// # Returns
    ///
    /// Returns a reference to the `filename` where the file will be saved.
    pub fn filename(&self) -> &str {
        &self.filename
    }
}

impl TryFrom<&Url> for Task {
    type Error = crate::error::Error;

    /// Attempts to create a `Task` from a URL reference.
    ///
    /// # Arguments
    ///
    /// * `url` - A reference to a `Url` object.
    ///
    /// # Returns
    ///
    /// Returns `Ok(Task)` if the URL contains a filename, or an `Error` if the URL is invalid or lacks a filename.
    fn try_from(url: &Url) -> Result<Self, Self::Error> {
        if let Some(filename) = url.as_str().split("/").last() {
            return Task::new(url, filename);
        }
        Err(Error::InvalidURL(url.to_string()))
    }
}

impl TryFrom<&str> for Task {
    type Error = crate::error::Error;

    /// Attempts to create a `Task` from a URL string.
    ///
    /// # Arguments
    ///
    /// * `url` - A URL string.
    ///
    /// # Returns
    ///
    /// Returns `Ok(Task)` if the URL string is valid and contains a filename, or an `Error` if parsing fails or the URL lacks a filename.
    fn try_from(url: &str) -> Result<Self, Self::Error> {
        if let Some(filename) = url.split("/").last() {
            return Task::new(&Url::parse(url)?, filename);
        }
        Err(Error::InvalidURL(url.to_string()))
    }
}
