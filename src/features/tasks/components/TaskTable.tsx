import { type TaskTable } from "@/features/tasks/types/TaskTable";

import TaskTableRow from "./TableRow";
import TaskTableHeader from "./TaskTableHeader";

interface TableProps {
  table: TaskTable;
}

export default function TaskTable({ table }: TableProps) {
  return (
    <table className="w-full">
      <thead
        className={`bg-secondary-background border-t border-b border-secondary-text/10`}
      >
        <TaskTableHeader headerGroup={table.getHeaderGroups()[0]} />
      </thead>
      <tbody className="text-black">
        {table.getRowModel().rows.map((row) => (
          <TaskTableRow
            key={row.id}
            row={row}
            onContextMenu={() => {
              if (!row.getIsSelected()) {
                table.resetRowSelection();
                row.toggleSelected(true);
              }
            }}
          />
        ))}
      </tbody>
    </table>
  );
}
