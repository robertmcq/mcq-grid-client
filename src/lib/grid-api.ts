/**
 * GRID API Client
 * Server-side only — proxies requests to mcq-ventures-core.
 * Never call this directly from client components.
 */

const GRID_API_URL = process.env.GRID_API_URL!;
const GRID_API_KEY = process.env.GRID_API_KEY!;

async function gridRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${GRID_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': GRID_API_KEY,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GRID API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export const gridApi = {
  health: () => gridRequest<{ status: string }>('/health'),

  route: (prospect: Record<string, unknown>) =>
    gridRequest('/route', { method: 'POST', body: JSON.stringify(prospect) }),

  submitIntake: (payload: Record<string, unknown>) =>
    gridRequest('/intake', { method: 'POST', body: JSON.stringify(payload) }),

  acceptIntake: (intakeId: string) =>
    gridRequest(`/intake/${intakeId}/accept`, { method: 'PATCH' }),

  queryEvidence: (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    return gridRequest(`/evidence/query?${qs}`);
  },
};
