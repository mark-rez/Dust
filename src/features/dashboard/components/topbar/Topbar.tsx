import { Pause, Play, Plus, RotateCw, Trash2 } from "lucide-react";

import { TaskTable } from "@/features/tasks/types/TaskTable";

import CurrentViewLabel from "./CurrentViewLabel";
import IconButton from "./IconButton";
import TaskCreationModal from "../modal/TaskCreationModal";

interface TopbarProps {
  table: TaskTable;
  handleTaskAction: (
    action: "spawn_tasks" | "pause_tasks" | "remove_tasks" | "restart_tasks",
    options?: { poll?: boolean; refreshAfter?: boolean },
  ) => Promise<void>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function Topbar({
  table,
  handleTaskAction,
  isModalOpen,
  setIsModalOpen
}: TopbarProps) {
  const buttons = [
    {
      icon: <Plus className="scale-120" />,
      onClick: () => setIsModalOpen(true),
    },
    {
      icon: <Trash2 />,
      onClick: () => handleTaskAction("remove_tasks", { refreshAfter: true }),
    },
    {
      icon: <RotateCw />,
      onClick: () => handleTaskAction("restart_tasks", { poll: true }),
    },
    {
      icon: <Play />,
      onClick: () => handleTaskAction("spawn_tasks", { poll: true }),
    },
    {
      icon: <Pause />,
      onClick: () => handleTaskAction("pause_tasks", { refreshAfter: true }),
    },
  ];

  return (
    <div className="px-5 py-4 flex items-center gap-20 justify-between">
      <CurrentViewLabel numberOfTasks={table.getCoreRowModel().rows.length} />

      <div className="flex gap-3 items-center">
        {buttons.map((button, index) => (
          <IconButton key={index} icon={button.icon} onClick={button.onClick} />
        ))}
      </div>

      {isModalOpen && <TaskCreationModal close={() => setIsModalOpen(false)} />}
    </div>
  );
}
