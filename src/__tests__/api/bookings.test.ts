import handler from '@/pages/api/bookings';
import { createMocks } from 'node-mocks-http';
import { prisma } from '@/lib/prisma';

// Ensure database is seeded before test or mock it
jest.mock('@/lib/prisma', () => {
  const actualPrisma = jest.requireActual('@/lib/prisma');
  return {
    prisma: {
      ...actualPrisma.prisma,
      timeSlot: {
        findUnique: jest.fn().mockResolvedValue({
          id: 1,
          isBooked: false,
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      booking: {
        create: jest.fn().mockResolvedValue({ id: 123 }),
      },
    },
  };
});

describe('POST /api/bookings', () => {
  it('creates a booking and returns 201', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        userId: 1,
        timeSlotId: 1,
        roomId: 1,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);

    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Booking successful');
    expect(data.bookingId).toBe(123);
  });

  it('returns 400 if required fields are missing', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('returns 405 if method is not POST', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});
