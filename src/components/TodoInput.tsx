import styles from "@/components/index.module.css";
import { Todo } from "@/services/TodoList.ts";
import cx from "classnames";
import { useRef } from "react";

type Props = {
  todo: Todo;
  onChange: (todo: Todo) => void;
  onEdit: (todoId: number | null) => void;
  editingId: number | null;
};

export const TodoInput = (props: Props) => {
  const { todo, onChange, onEdit, editingId } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const editing = todo.id === editingId;

  if (!editing) {
    return (
      <p
        className="ml-2 px-2 h-8 min-w-[200px] flex items-center border border-transparent cursor-pointer"
        onClick={() => {
          onEdit(todo.id);
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }}
      >
        {todo.task || ""}
      </p>
    );
  }

  return (
    <input
      ref={inputRef}
      className={cx(
        styles.input,
        "ml-2 px-2 py-1 min-w-[200px] border rounded",
      )}
      type="text"
      onChange={(e) => {
        onChange({
          ...todo,
          task: e.target.value,
        });
      }}
      onKeyDown={(e) => {
        if (e.code === "Escape") {
          onEdit(null);
        }
      }}
      onBlur={() => {
        onEdit(null);
      }}
      value={todo.task}
    />
  );
};
