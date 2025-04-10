import { getSwaggerSpec } from '@/utils/swagger';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const spec = getSwaggerSpec();
  res.status(200).json(spec);
}
