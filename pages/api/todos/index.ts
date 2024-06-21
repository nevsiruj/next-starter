import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const { data: todos, error } = await supabase.from('todos').select('*');
      if (error) return res.status(500).json({ success: false, error });
      res.status(200).json({ success: true, data: todos });
      break;
    case 'POST':
      const { title, description } = req.body;
      const { data: newTodo, error: postError } = await supabase
        .from('todos')
        .insert([{ title, description }])
        .single();
      if (postError)
        return res.status(500).json({ success: false, error: postError });
      res.status(201).json({ success: true, data: newTodo });
      break;
    default:
      res
        .status(405)
        .json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}
