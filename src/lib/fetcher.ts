const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * <summary>
 * Generic GET fetcher used with SWR hooks.
 * Automatically attaches base URL and parses JSON.
 * </summary>
 * @param endpoint Relative API route (e.g., "/rooms")
 * @returns Parsed JSON response
 * @throws Error if response is not ok
 */
export const fetcher = async <T>(endpoint: string): Promise<T> => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return res.json();
};

/**
 * <summary>
 * Generic POST request function used with SWR Mutation.
 * </summary>
 * @template TInput - Request payload type
 * @template TOutput - Expected response type
 * @param url Full or relative API URL
 * @param arg The data object to POST
 * @returns Parsed JSON response
 * @throws Error with message from server if not ok
 */
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
