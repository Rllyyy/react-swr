import { MutatorOptions } from "swr";
import { addTodo, updateTodo, deleteTodo } from "../api/todosApi";
import { ITodo } from "../features/todos/TodoList";

export const addMutation = async (newTodo: ITodo, todos: ITodo[] | undefined) => {
  const added = await addTodo(newTodo);
  return [...(todos || []), added].sort((a, b) => b.id - a.id);
};

export const addTodoOptions = (newTodo: ITodo, todos: ITodo[] | undefined): MutatorOptions => {
  return {
    optimisticData: [...(todos || []), newTodo].sort((a, b) => b.id - a.id),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

/* --------------------------------- update Mutation -------------------------------*/
export const updateMutation = async (updatedTodo: ITodo, todos: ITodo[] | undefined) => {
  const updated = await updateTodo(updatedTodo);

  const prevTodos = (todos || []).filter((todo) => todo.id !== updatedTodo.id);

  return [...prevTodos, updated].sort((a, b) => b.id - a.id);
};

export const updateTodoOptions = (updatedTodo: ITodo, todos: ITodo[] | undefined): MutatorOptions => {
  // Remove updated todo from array
  const prevTodos = (todos || []).filter((todo) => {
    return todo.id !== updatedTodo.id;
  });

  return {
    optimisticData: [...prevTodos, updatedTodo].sort((a, b) => b.id - a.id),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

/* ------------------------------------- delete Mutation -------------------------- */
export const deleteMutation = async (deletedTodoId: ITodo["id"], todos: ITodo[] | undefined) => {
  await deleteTodo({ id: deletedTodoId });

  return (todos || []).filter((todo) => todo.id !== deletedTodoId);
};

export const deleteTodoOptions = (deletedTodoId: ITodo["id"], todos: ITodo[] | undefined): MutatorOptions => {
  const prevTodos = (todos || []).filter((todo) => todo.id !== deletedTodoId);

  return {
    optimisticData: prevTodos,
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};
