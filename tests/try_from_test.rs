#[cfg(test)]
mod tests {
    use dust::download::Task;
    use url::Url;

    const EXAMPLE_URL: &str = "http://212.183.159.230/100MB.zip";

    #[tokio::test]
    async fn try_from_str_test() {
        let result = Task::try_from(EXAMPLE_URL);
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn try_from_url_test() {
        let result = Task::try_from(&Url::parse(EXAMPLE_URL).unwrap());
        assert!(result.is_ok());
    }
}
