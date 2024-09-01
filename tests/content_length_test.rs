#[cfg(test)]
mod tests {
    use dust::download::Task;

    const EXAMPLE_URL: &str = "http://212.183.159.230/100MB.zip";

    #[tokio::test]
    async fn get_content_size() {
        let task = Task::try_from(EXAMPLE_URL).unwrap();
        assert!(task.content_length().await.unwrap() == 104857600)
    }
}
