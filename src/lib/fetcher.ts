
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Generic fetcher with type safety
export const fetcher = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
};