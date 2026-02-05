const API_BASE =
  typeof window !== "undefined"
    ? "/api"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const url = path.startsWith("/") ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    throw new Error(
      "Could not reach the backend. Ensure the AI server is running (port 8000)."
    );
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  submitEmployeeReview: (data: unknown) =>
    post<{ received: boolean; employee_id: string }>("/review/employee", data),

  submitManagerReview: (data: unknown) =>
    post<{ received: boolean; employee_id: string }>("/review/manager", data),

  evaluate: (employee: Record<string, unknown>, manager: Record<string, unknown>) =>
    post<{
      hike_score: number;
      verdict: string;
      serious_feedback: string;
      genz_feedback: string;
      risk_flags: string[];
    }>("/evaluate", { employee, manager }),
};
