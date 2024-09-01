use std::io::Write;
use dust::download::Task;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // User input
    let mut url = String::new();
    print!("URL: ");
    std::io::stdout().flush()?;
    std::io::stdin().read_line(&mut url)?;

    let url = url.trim();

    // Attempt to create a `Task` from the trimmed URL
    let task = Task::try_from(url).map_err(|e| format!("Failed to create task: {}", e))?;

    task.download()
        .await
        .map_err(|e| format!("Download failed: {}", e))?;

    Ok(())
}
