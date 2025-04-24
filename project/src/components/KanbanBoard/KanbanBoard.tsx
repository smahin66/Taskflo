import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task } from '../../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskToggle: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskToggle,
  onTaskDelete,
  onTaskEdit,
}) => {
  const [categories, setCategories] = useState(() => {
    const uniqueCategories = Array.from(new Set(tasks.map(task => task.category || 'Non catégorisé')));
    return uniqueCategories;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('Drag start:', active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.indexOf(String(active.id));
        const newIndex = items.indexOf(String(over.id));
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tableau des tâches</h2>
      
      <div className="overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4 min-w-max">
            <SortableContext
              items={categories}
              strategy={horizontalListSortingStrategy}
            >
              {categories.map((category) => (
                <KanbanColumn
                  key={category}
                  id={category}
                  title={category}
                  tasks={tasks.filter(task => (task.category || 'Non catégorisé') === category)}
                  onTaskToggle={onTaskToggle}
                  onTaskDelete={onTaskDelete}
                  onTaskEdit={onTaskEdit}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;