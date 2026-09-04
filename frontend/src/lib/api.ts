export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://credit-card-fraud-detection-system-ds61.onrender.com";

  const response = await fetch(
    `${baseUrl}${endpoint}`,
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