import { TodoInput } from "@/components/TodoInput.tsx";
import styles from "@/components/index.module.css";
import { Todo } from "@/services/TodoList.ts";
import cx from "classnames";
import { useDrag, useDrop } from "react-dnd";

const DRAG_ITEM_TYPE = "TODO";

type Props = {
  todo: Todo;
  onToggle: (todoId: number) => void;
  onChange: (todo: Todo) => void;
  onRemove: (todo: Todo) => void;
  onEdit: (todoId: number | null) => void;
  editingId: number | null;
  onDrop: (dragItem: Todo, dropTarget: Todo) => void;
};

export const TodoListRow = (props: Props) => {
  const { todo, onDrop, onToggle, onChange, onRemove } = props;

  const [_, dropRef] = useDrop<{ todo: Todo }>(
    () => ({
      accept: DRAG_ITEM_TYPE,
      drop: (item, _monitor) => onDrop(item.todo, todo),
    }),
    [todo],
  );

  const [__, dragRef, dragPreviewRef] = useDrag(() => ({
    type: DRAG_ITEM_TYPE,
    item: { todo },
    collect: (_monitor) => {
      return {};
    },
  }));

  return (
    <li
      className="bg-white"
      ref={(r) => {
        if (r) {
          dropRef(dragPreviewRef(r));
        }
      }}
    >
      <div className="flex items-center">
        <button
          ref={dragRef}
          className="mt-[-3px] h-8 flex items-center text-3xl text-gray-400 cursor-grab"
        >
          =
        </button>

        <input
          className={cx(styles.checkbox, "ml-2")}
          type="checkbox"
          onChange={() => onToggle(todo.id)}
          checked={todo.done}
        />

        <TodoInput
          todo={todo}
          onChange={(todo) => onChange(todo)}
          onEdit={props.onEdit}
          editingId={props.editingId}
        />

        <button className="ml-4" onClick={() => onRemove(todo)}>
          ✗
        </button>
      </div>
    </li>
  );
};
