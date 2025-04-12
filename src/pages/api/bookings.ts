import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log('Received payload:', req.body);

  const { userName, timeSlotId, roomId } = req.body;

  if (!userName || !timeSlotId || !roomId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const slot = await prisma.timeSlot.findUnique({ where: { id: timeSlotId } });

    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const booking = await prisma.booking.create({
      data: {
        userName,
        timeSlotId,
        roomId,
      },
    });

    await prisma.timeSlot.update({
      where: { id: timeSlotId },
      data: {
        isBooked: true,
      },
    });

    res.status(201).json({ message: 'Booking successful', bookingId: booking.id });
  } catch (error) {
    console.error('Booking API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
