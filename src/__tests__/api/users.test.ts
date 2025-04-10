import handler from '@/pages/api/users';
import { createMocks } from 'node-mocks-http';
import { prisma } from '@/lib/prisma';

// Mock the Prisma client
jest.mock('@/lib/prisma', () => {
  const actualPrisma = jest.requireActual('@/lib/prisma');
  return {
    prisma: {
      ...actualPrisma.prisma,
      user: {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, name: 'Alice', email: 'alice@example.com' },
          { id: 2, name: 'Bob', email: 'bob@example.com' },
        ]),
      },
    },
  };
});

describe('GET /api/users', () => {
  it('returns a list of users', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0].name).toBe('Alice');
  });

  it('returns 405 for non-GET methods', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(405);
  });
});
