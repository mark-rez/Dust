use dust::download::Task;

#[tokio::main]
async fn main() {
    let task = Task::try_from("http://212.183.159.230/100MB.zip").unwrap();
    task.download().await.unwrap();
}
