import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types';
import TaskCard from '../TaskList/TaskCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-xl p-4 min-w-[300px] max-w-[300px]"
    >
      <div
        className="flex items-center justify-between mb-4 cursor-move"
        {...attributes}
        {...listeners}
      >
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
          {tasks.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskToggle={onTaskToggle}
            onTaskDelete={onTaskDelete}
            onTaskEdit={onTaskEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;