import { flexRender, Row } from "@tanstack/react-table";

import { Task } from "@/features/tasks/types/Task";

interface TaskTableRowProps {
  row: Row<Task>;
  onContextMenu: (event: React.MouseEvent) => void;
}

export default function TaskTableRow({ row, onContextMenu }: TaskTableRowProps) {
  return (
    <tr
      key={row.id}
      onContextMenu={onContextMenu}
      className={`border-b border-secondary-text/20 transition-colors ${
        row.getIsSelected() ? "bg-blue-600/10" : "hover:bg-secondary-text/5"
      }`}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="py-6 px-4">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}
