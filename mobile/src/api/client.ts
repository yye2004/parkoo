import { Platform } from "react-native";

const defaultBase =
  Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || defaultBase;

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) {
    const message = await safeError(res);
    throw new Error(message || `Request failed with ${res.status}`);
  }
  return res.json();
}

async function safeError(res: Response) {
  try {
    const data = await res.json();
    return data.error || data.message || "";
  } catch {
    return "";
  }
}

export const api = {
  baseUrl,
  get: <T>(path: string, token?: string) => request<T>(path, { token }),
  post: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, { method: "POST", body, token }),
  patch: <T>(path: string, body?: unknown, token?: string) =>
    request<T>(path, { method: "PATCH", body, token })
};

