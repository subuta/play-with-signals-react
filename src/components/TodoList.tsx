import { TodoListRow } from "@/components/TodoListRow.tsx";
import { Todo, getTaskId, getTodoListService } from "@/services/TodoList.ts";
import cx from "classnames";
import { useEffect, useState } from "react";

import styles from "./index.module.css";

const DEFAULT_TODOS: Todo[] = [
  {
    id: getTaskId(),
    task: "",
    done: false,
  },
];

const todoListService = getTodoListService(DEFAULT_TODOS);

export const TodoList = () => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [useSync, setUseSync] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const todos = todoListService.state.value;

  useEffect(() => {
    if (todoListService.hasLastSyncLS()) {
      // Load last state from LocalStorage
      todoListService.loadLS();
      // Enable sync LocalStorage.
      setUseSync(true);
    }
    setEditingId(todos[0].id);
    setInitialized(true);
  }, []);

  useEffect(() => {
    let dispose: () => void | undefined;
    if (useSync) {
      dispose = todoListService.syncLS();
    }
    return () => {
      dispose && dispose();
    };
  }, [useSync]);

  console.log("onChange", JSON.stringify(todos, null, 2));

  if (!initialized) return null;

  return (
    <div>
      <ul className={styles.list}>
        {todos.map((todo) => {
          return (
            <TodoListRow
              key={todo.id}
              todo={todo}
              onToggle={(todoId) => {
                todoListService.toggle(todoId);
              }}
              onChange={(todo: Todo) => {
                todoListService.upsert(todo);
              }}
              onDrop={(dragItem, dropTarget) => {
                todoListService.swap(dragItem.id, dropTarget.id);
              }}
              onRemove={(todo) => {
                todoListService.remove(todo.id);
                const result = todoListService.state.value;
                if (result.length === 0) {
                  todoListService.reset();
                }
              }}
              onEdit={setEditingId}
              editingId={editingId}
            />
          );
        })}
      </ul>

      <div className="mt-4 flex items-center">
        <button
          className={styles.button}
          onClick={() => {
            const taskId = todoListService.upsert({
              task: "",
              done: false,
            });
            setEditingId(taskId);
          }}
        >
          Add task
        </button>

        <button
          className={cx("ml-4", styles.button)}
          onClick={() => {
            todoListService.reset();
          }}
        >
          Reset
        </button>

        <button
          className={cx("ml-4", styles.button)}
          onClick={() => {
            // If previously enabled.
            if (useSync) {
              // Reset LS data on stop.
              todoListService.resetLS();
            }
            setUseSync(!useSync);
          }}
        >
          {useSync ? "Stop LocalStorage" : "Sync LocalStorage"}
        </button>
      </div>
    </div>
  );
};
