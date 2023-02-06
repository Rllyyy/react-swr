import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import useSWR from "swr";

import { getTodos, addTodo, deleteTodo, updateTodo, todosUrlEndpoint as cacheKey } from "../../api/todosApi";

import { addTodoOptions, deleteTodoOptions, updateTodoOptions } from "../../api/todosSWROptions";

export interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");

  // Add useSWR here
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useSWR<ITodo[], Error>(cacheKey, getTodos, {
    onSuccess: (data: ITodo[]) => data.sort((a, b) => b.id - a.id),
  });

  const addTodoMutation = async (newTodo: ITodo) => {
    try {
      // call API & mutate here
      await mutate(addTodo(newTodo), addTodoOptions(newTodo));

      toast.success("Success! Added new item.", {
        duration: 1000,
        icon: "🎉",
      });
    } catch (err) {
      toast.error("Failed to add the new item.", {
        duration: 1000,
      });
    }
  };

  const updateTodoMutation = async (updatedTodo: ITodo) => {
    try {
      await mutate(updateTodo(updatedTodo), updateTodoOptions(updatedTodo));

      toast.success("Success! Updated item.", {
        duration: 1000,
        icon: "🚀",
      });
    } catch (err) {
      toast.error("Failed to update the item.", {
        duration: 1000,
      });
    }
  };

  const deleteTodoMutation = async ({ id }: { id: ITodo["id"] }) => {
    try {
      await mutate(deleteTodo({ id }), deleteTodoOptions({ id }));

      toast.success("Success! Deleted item.", {
        duration: 1000,
      });
    } catch (err) {
      toast.error("Failed to delete the item.", {
        duration: 1000,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodoMutation({ userId: 1, title: newTodo, completed: false, id: 9999 });
    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor='new-todo'>Enter a new todo item</label>
      <div className='new-todo'>
        <input
          type='text'
          id='new-todo'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder='Enter new todo'
        />
      </div>
      <button className='submit'>
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>{error.message}</p>;
  } else {
    content = todos?.map((todo) => {
      return (
        <article key={todo.id}>
          <div className='todo'>
            <input
              type='checkbox'
              checked={todo.completed}
              id={todo.id.toString()}
              onChange={() => updateTodoMutation({ ...todo, completed: !todo.completed })}
            />
            <label htmlFor={todo.id.toString()}>{todo.title}</label>
          </div>
          <button className='trash' onClick={() => deleteTodoMutation({ id: todo.id })}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
  }

  return (
    <main>
      <Toaster toastOptions={{ position: "top-center" }} />
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};
export default TodoList;
