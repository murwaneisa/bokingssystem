// pages/api/timeslots/filter.ts
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { start, end, roomIds } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: 'Missing start or end date' });
  }

  const startDate = new Date(start as string);
  const endDate = new Date(end as string);

  try {
    const timeslots = await prisma.timeSlot.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(roomIds
          ? {
              roomId: {
                in: Array.isArray(roomIds)
                  ? roomIds.map((id) => parseInt(id))
                  : [parseInt(roomIds as string)],
              },
            }
          : {}),
      },
      include: {
        room: true,
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    res.status(200).json(timeslots);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}
