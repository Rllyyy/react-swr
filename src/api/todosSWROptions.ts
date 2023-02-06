import { MutatorOptions } from "swr";
import { ITodo } from "../features/todos/TodoList";

export const addTodoOptions = (newTodo: ITodo): MutatorOptions => {
  // optimistic data displays until we populate cache
  // param is previous data
  return {
    optimisticData: (todos: ITodo[]) => [...(todos || []), newTodo].sort((a, b) => b.id - a.id),
    rollbackOnError: true,
    populateCache: (added, todos) => [...(todos || []), added].sort((a, b) => b.id - a.id),
    revalidate: false,
  };
};

export const updateTodoOptions = (updatedTodo: ITodo): MutatorOptions => {
  const getData = (todos: ITodo[], changedTodo: ITodo) => {
    // Remove updated todo from array
    const prevTodos = (todos || []).filter((todo) => {
      return todo.id !== changedTodo.id;
    });

    // Add updated item back and resort it
    return [...prevTodos, changedTodo].sort((a, b) => b.id - a.id);
  };

  return {
    optimisticData: (todos: ITodo[]) => getData(todos, updatedTodo),
    rollbackOnError: true,
    populateCache: (result, currentData) => getData(currentData, result),
    revalidate: false,
  };
};

export const deleteTodoOptions = ({ id }: { id: ITodo["id"] }): MutatorOptions => {
  return {
    optimisticData: (todos: ITodo[]) => todos.filter((todo) => todo.id !== id),
    rollbackOnError: true,
    populateCache: (emptyRes, currentData) => currentData.filter((todo: ITodo) => todo.id !== id),
    revalidate: false,
  };
};
