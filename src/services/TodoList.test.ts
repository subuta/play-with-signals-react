import { describe, expect, it } from "vitest";

import { getTaskId, getTodoListService } from "./TodoList.ts";

describe('"TodoList service"', () => {
  it("should filled with initial state", () => {
    const todoListService = getTodoListService([
      { id: getTaskId(), done: false, task: "Buy egg" },
    ]);

    expect(todoListService.state.value).toEqual([
      { id: expect.any(Number), done: false, task: "Buy egg" },
    ]);
  });

  it("should allow adding todo task", () => {
    const todoListService = getTodoListService([
      { id: getTaskId(), done: false, task: "Buy egg" },
    ]);

    const id = todoListService.upsert({
      done: false,
      task: "Buy milk",
    });
    expect(id).toEqual(expect.any(Number));

    expect(todoListService.state.value).toEqual([
      { id: expect.any(Number), done: false, task: "Buy egg" },
      { id: expect.any(Number), done: false, task: "Buy milk" },
    ]);
  });

  it("should allow updating todo task", () => {
    const todoListService = getTodoListService([
      { id: 1, done: false, task: "Buy egg" },
    ]);

    todoListService.upsert({
      id: 1,
      done: false,
      task: "Updated",
    });

    expect(todoListService.state.value).toEqual([
      { id: 1, done: false, task: "Updated" },
    ]);
  });

  it("should allow toggling todo task", () => {
    const todoListService = getTodoListService([
      { id: 1, done: false, task: "Buy egg" },
    ]);

    todoListService.toggle(1);

    expect(todoListService.state.value).toEqual([
      { id: 1, done: true, task: "Buy egg" },
    ]);
  });

  it("should allow removing todo task", () => {
    const todoListService = getTodoListService([
      { id: 1, done: false, task: "Buy egg" },
      { id: 2, done: false, task: "Buy milk" },
    ]);

    todoListService.remove(2);

    expect(todoListService.state.value).toEqual([
      { id: 1, done: false, task: "Buy egg" },
    ]);
  });

  it("should allow resetting todo task", () => {
    const todoListService = getTodoListService([]);

    todoListService.upsert({
      done: false,
      task: "Buy egg",
    });

    // After adding task
    expect(todoListService.state.value).toEqual([
      { id: expect.any(Number), done: false, task: "Buy egg" },
    ]);

    todoListService.reset();

    // After resetting task
    expect(todoListService.state.value).toEqual([]);
  });

  it("should allow swapping todo task", () => {
    const todoListService = getTodoListService([
      { id: 1, done: false, task: "Buy egg" },
      { id: 2, done: false, task: "Buy milk" },
      { id: 3, done: false, task: "Buy fish" },
    ]);

    todoListService.swap(1, 2);

    expect(todoListService.state.value).toEqual([
      { id: 2, done: false, task: "Buy milk" },
      { id: 1, done: false, task: "Buy egg" },
      { id: 3, done: false, task: "Buy fish" },
    ]);
  });
});
