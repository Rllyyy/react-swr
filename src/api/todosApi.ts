import axios from "axios";
import { ITodo } from "../features/todos/TodoList";

const delay = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 800));

const todosApi = axios.create({
  baseURL: "http://localhost:3500",
});

export const todosUrlEndpoint = "/todos";

export const getTodos = async () => {
  await delay();
  const response = await todosApi.get(todosUrlEndpoint);
  return response.data;
};

export const addTodo = async ({ userId, title, completed }: ITodo): Promise<any> => {
  await delay();
  const response = await todosApi.post(todosUrlEndpoint, { userId, title, completed });
  console.log(response.data);
  return response.data;
};

export const updateTodo = async (todo: ITodo): Promise<any> => {
  await delay();
  const response = await todosApi.patch(`${todosUrlEndpoint}/${todo.id}`, todo);
  return response.data;
};

export const deleteTodo = async ({ id }: { id: number }) => {
  await delay();
  const response = await todosApi.delete(`${todosUrlEndpoint}/${id}`);
  return response.data;
};
