export async function fetcher<T = unknown>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(
      (body as { error?: string }).error || `Request failed (${res.status})`
    );
    (error as Error & { status?: number }).status = res.status;
    throw error;
  }
  return res.json();
}
