
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


export async function postRequest<TInput, TOutput>(
  url: string,
  { arg }: { arg: TInput }
): Promise<TOutput> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return res.json();
}
