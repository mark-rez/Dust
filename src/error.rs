use thiserror::Error;

/// Represents various error types that can occur in the application.
#[derive(Error, Debug)]
pub enum Error {
    /// An error occurring during I/O operations.
    #[error("I/O error")]
    IO {
        #[from]
        /// The underlying `std::io::Error` that caused this error.
        source: std::io::Error,
    },
    
    /// An error occurring in the Reqwest HTTP client.
    #[error("Reqwest Error")]
    Reqwest {
        #[from]
        /// The underlying `reqwest::Error` that caused this error.
        source: reqwest::Error,
    },
    
    /// An error occurring while parsing a URL.
    #[error("ParseURL Error")]
    ParseURL {
        #[from]
        /// The underlying `url::ParseError` that caused this error.
        source: url::ParseError,
    },
    
    /// An error indicating that an invalid URL was encountered.
    #[error("Invalid URL: {0}")]
    InvalidURL(String),
}
