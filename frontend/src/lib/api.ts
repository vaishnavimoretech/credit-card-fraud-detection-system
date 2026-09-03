export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {
  const response = await fetch(
    `http://127.0.0.1:8000${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}