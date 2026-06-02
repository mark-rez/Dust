import { Pause, Play, RotateCw, Trash2 } from "lucide-react";

import { useContextMenu } from "@/features/tasks/hooks/useContextMenu";

interface ContextMenuProps {
  handleTaskAction: (action: any, options?: any) => Promise<void>;
  setIsModalOpen: (open: boolean) => void;
}

export default function ContextMenu({ handleTaskAction }: ContextMenuProps) {
  const { visible, setVisible, coords, menuRef } = useContextMenu();

  const buttons = [
    {
      label: "Start",
      icon: <Play size={16} />,
      onClick: () => handleTaskAction("spawn_tasks", { poll: true }),
    },
    {
      label: "Restart",
      icon: <RotateCw size={16} />,
      onClick: () => handleTaskAction("restart_tasks", { refreshAfter: true }),
    },
    {
      label: "Stop",
      icon: <Pause size={16} />,
      onClick: () => handleTaskAction("pause_tasks", { refreshAfter: true }),
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      onClick: () => handleTaskAction("remove_tasks", { refreshAfter: true }),
      className: "text-red-500 hover:bg-red-500 hover:text-white mt-1 border-t border-white/10",
    },
  ];

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-9999 min-w-45 bg-secondary-background border border-secondary-text/20 rounded-lg shadow-2xl py-1"
      style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
    >
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={async (e) => {
            e.stopPropagation();
            await btn.onClick();
            setVisible(false);
          }}
          className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-blue-600 hover:text-white group ${btn.className || 'text-primary-text'}`}
        >
          <span className="opacity-70 group-hover:opacity-100">{btn.icon}</span>
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
