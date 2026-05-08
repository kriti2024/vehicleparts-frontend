import { api } from './api'

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  email: string
  token: string
  newPassword: string
}

// These paths match common ASP.NET patterns. If your backend differs,
// change them here (or set VITE_AUTH_* env vars).
const FORGOT_PATH =
  (import.meta.env.VITE_AUTH_FORGOT_PATH as string | undefined) ?? '/Auth/forgot-password'
const RESET_PATH =
  (import.meta.env.VITE_AUTH_RESET_PATH as string | undefined) ?? '/Auth/reset-password'

export async function forgotPassword(input: ForgotPasswordRequest): Promise<void> {
  await api.post<void>(FORGOT_PATH, input)
}

export async function resetPassword(input: ResetPasswordRequest): Promise<void> {
  await api.post<void>(RESET_PATH, input)
}

