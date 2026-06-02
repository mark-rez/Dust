import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

import ContextMenu from "@/features/dashboard/components/contextMenu/contextMenu";
import TaskTable from "@/features/tasks/components/TaskTable";
import { useTaskTable } from "@/features/tasks/hooks/useTaskTable";
import { useTaskStore } from "@/stores/taskStore";

import Topbar from "./topbar/Topbar";

export default function Dashboard() {
  const table = useTaskTable();

  const setShouldPoll = useTaskStore((state) => state.setShouldPoll);
  const refresh = useTaskStore((state) => state.refresh);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskAction = async (
    action: "spawn_tasks" | "pause_tasks" | "remove_tasks" | "restart_tasks",
    options?: { poll?: boolean; refreshAfter?: boolean },
  ) => {
    const hashes = table
      .getCoreRowModel()
      .flatRows.filter((row) => row.getIsSelected())
      .map((row) => row.original.hash);

    if (!hashes.length) return;

    try {
      await invoke(action, { hashes });

      if (options?.poll) setShouldPoll(true);
      if (options?.refreshAfter) refresh();

      table.resetRowSelection();
    } catch (error) {
      console.error("Tauri Invoke Error:", error);
    }
  };

  return (
    <section className="relative py-2 grow bg-primary-background rounded-xl outline-1 outline-secondary-text/20">
      <Topbar
        table={table}
        handleTaskAction={handleTaskAction}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <TaskTable table={table} />

      <ContextMenu
        handleTaskAction={handleTaskAction}
        setIsModalOpen={setIsModalOpen}
      />
    </section>
  );
}
