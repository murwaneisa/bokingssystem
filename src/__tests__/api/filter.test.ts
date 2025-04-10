import handler from '@/pages/api/timeslots/filter';
import { createMocks } from 'node-mocks-http';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => {
  const actual = jest.requireActual('@/lib/prisma');
  return {
    prisma: {
      ...actual.prisma,
      timeSlot: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
            date: new Date('2025-04-18'),
            startTime: new Date('2025-04-18T08:00:00'),
            endTime: new Date('2025-04-18T09:00:00'),
            isBooked: false,
            room: {
              id: 2,
              name: 'Steve',
              capacity: 6,
              features: [],
            },
          },
        ]),
      },
    },
  };
});

describe('GET /api/timeslots/filter', () => {
  it('returns filtered timeslots with room info', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        start: '2025-04-18',
        end: '2025-04-20',
        roomIds: ['2'],
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());

    expect(Array.isArray(data)).toBe(true);
    expect(data[0].room.name).toBe('Steve');
  });

  it('returns 400 if start or end date is missing', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        start: '2025-04-18',
        // missing 'end'
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('returns 405 for non-GET method', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});
