export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? 'https://localhost:7117/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorBody: unknown = await response.json()
      if (typeof errorBody === 'string') {
        message = errorBody
      } else if (
        typeof errorBody === 'object' &&
        errorBody !== null &&
        'title' in errorBody &&
        typeof (errorBody as { title?: unknown }).title === 'string'
      ) {
        message = (errorBody as { title: string }).title
      }
    } catch {
      const text = await response.text()
      if (text) message = text
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const api = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: unknown) =>
    request<void>(path, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}

