import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      const { data: todo, error: getError } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .single();
      if (getError)
        return res.status(404).json({ success: false, error: getError });
      res.status(200).json({ success: true, data: todo });
      break;
    case 'PUT':
      const { data: updatedTodo, error: putError } = await supabase
        .from('todos')
        .update(req.body)
        .eq('id', id)
        .single();
      if (putError)
        return res.status(404).json({ success: false, error: putError });
      res.status(200).json({ success: true, data: updatedTodo });
      break;
    case 'DELETE':
      const { data: deletedTodo, error: deleteError } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .single();
      if (deleteError)
        return res.status(404).json({ success: false, error: deleteError });
      res.status(200).json({ success: true, data: deletedTodo });
      break;
    default:
      res
        .status(405)
        .json({ success: false, message: `Method ${method} Not Allowed` });
      break;
  }
}
