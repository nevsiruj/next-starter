'use client';

import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data.data);
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Title and Description are required');
      return;
    }
    const newTodo = { title, description };
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    });
    const data = await res.json();
    setTodos([...todos, data.data]);
    setTitle('');
    setDescription('');
  };

  const handleDeleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = async (id: number) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) return;
    const updatedTodo = { ...todo, completed: !todo.completed };
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });
    const data = await res.json();
    setTodos(todos.map((todo) => (todo.id === id ? data.data : todo)));
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Todo List</h1>
      <div className="mb-6 flex flex-col md:flex-row">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          className="border p-3 rounded-lg mb-4 md:mb-0 md:mr-2 flex-1 text-black"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
          className="border p-3 rounded-lg mb-4 md:mb-0 md:mr-2 flex-1 text-black"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Add Todo
        </button>
      </div>
      <ul className="space-y-4">
        {todos.map(
          (todo) =>
            todo && (
              <li
                key={todo.id}
                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <h2 className="text-xl text-gray-600 font-semibold">
                    {todo.title}
                  </h2>
                  <p className="text-gray-600">{todo.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleComplete(todo.id)}
                    className={`p-2 rounded-lg font-semibold ${
                      todo.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                    } hover:bg-green-600 transition duration-300`}
                  >
                    {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="bg-red-500 text-white p-2 rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default TodosPage;
