import { NextApiRequest, NextApiResponse } from 'next';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

let todos: Todo[] = [
  {
    id: 1,
    title: 'Todo 1',
    description: 'This is the first todo',
    completed: false,
  },
  {
    id: 2,
    title: 'Todo 2',
    description: 'This is the second todo',
    completed: true,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json({ success: true, data: todos });
      break;
    case 'POST':
      const newTodo: Todo = { ...req.body, id: Date.now() };
      todos.push(newTodo);
      res.status(201).json({ success: true, data: newTodo });
      break;
    default:
      res
        .status(405)
        .json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}
