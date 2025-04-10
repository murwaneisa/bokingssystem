import handler from '@/pages/api/rooms'; // Import your Next.js API route
import { createMocks } from 'node-mocks-http'; // Simulates req/res objects

describe('GET /api/rooms', () => {
  it('returns a list of rooms', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res); // Call your API route handler manually

    expect(res._getStatusCode()).toBe(200); // Check response status
    const data = JSON.parse(res._getData()); // Parse response JSON

    expect(Array.isArray(data)).toBe(true); // Assert it's an array
  });
});
