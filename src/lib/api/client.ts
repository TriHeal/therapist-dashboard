import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError, ApiError } from "./errors";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** True when a backend URL is configured. Services use this to toggle API vs mock. */
export const USE_API = !!BASE_URL;

export async function apiFetch<T>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
): Promise<T> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");

  const token = (await cookies()).get("session")?.value;
  if (!token) throw new AuthError();

  const { body, headers: extraHeaders, ...rest } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) throw new ApiError(res.status, await res.text());

  return res.json() as Promise<T>;
}
