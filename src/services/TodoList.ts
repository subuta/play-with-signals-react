import { effect, signal } from "@preact/signals-react";
import { produce } from "immer";
import _ from "lodash";

export type Todo = {
  id: number;
  task: string;
  done: boolean;
};

const TODOS_LS_KEY = "com.sub-labo.pwsr.TODOS";

export const getTaskId = (todos: Todo[] = []) => {
  const maxId = Number(_.max(_.map(todos, "id")) || 0);
  return maxId + 1;
};

export const getTodoListService = (initialState?: Todo[]) => {
  const todos = signal<Todo[]>(initialState || []);

  return {
    state: todos,

    upsert(todo: Omit<Todo, "id"> & { id?: number }) {
      // For update.
      if (todo.id) {
        todos.value = produce(todos.value, (draft) => {
          const idx = draft.findIndex(({ id }) => todo.id === id);
          draft[idx] = {
            ...todo,
            id: todo.id!,
          };
        });
        return todo.id;
      } else {
        // For insert.
        const nextId = getTaskId(todos.value);
        todos.value = produce(todos.value, (draft) => {
          draft.push({
            ...todo,
            id: nextId,
          });
        });
        return nextId;
      }
    },

    remove(id: number) {
      todos.value = produce(todos.value, (draft) => {
        const idx = draft.findIndex((todo) => todo.id === id);
        draft.splice(idx, 1);
      });
    },

    toggle(id: number) {
      todos.value = produce(todos.value, (draft) => {
        const idx = draft.findIndex((todo) => todo.id === id);
        if (draft[idx]) {
          draft[idx].done = !draft[idx].done;
        }
      });
    },

    swap(id: number, otherId: number) {
      todos.value = produce(todos.value, (draft) => {
        const idx = draft.findIndex((todo) => todo.id === id);
        const otherIdx = draft.findIndex((todo) => todo.id === otherId);
        [draft[idx], draft[otherIdx]] = [draft[otherIdx], draft[idx]];
      });
    },

    reset() {
      todos.value = initialState || [];
    },

    syncLS() {
      return effect(() => {
        localStorage.setItem(TODOS_LS_KEY, JSON.stringify(todos.value));
      });
    },

    loadLS() {
      const data = this.readLS();
      if (data) {
        todos.value = data;
      }
    },

    readLS() {
      const data = localStorage.getItem(TODOS_LS_KEY);
      try {
        return JSON.parse(data || "") as Todo[];
      } catch (err) {
        return null;
      }
    },

    resetLS() {
      localStorage.removeItem(TODOS_LS_KEY);
    },

    hasLastSyncLS() {
      return !!this.readLS();
    },
  };
};

export type TodoListService = ReturnType<typeof getTodoListService>;
