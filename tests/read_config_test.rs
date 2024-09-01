#[cfg(test)]
mod tests {
    use std::fs;

    #[tokio::test]
    async fn read_config_test() {
        assert!(fs::read_to_string("config.json").is_ok());
    }
}
