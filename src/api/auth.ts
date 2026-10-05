import { apiFetch } from '@/lib/api'
import type {
  AuthResponse,
  ConnectedProfessor,
  ConnectedStudent,
  LoginRequest,
  RegisterRequest,
} from '@/types/api'

export function login(body: LoginRequest) {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function register(body: RegisterRequest) {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function logout(refreshToken: string) {
  return apiFetch<void>('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

export function listConnectedStudents() {
  return apiFetch<ConnectedStudent[]>('/api/professor/students')
}

export function listMyProfessors() {
  return apiFetch<ConnectedProfessor[]>('/api/student/professors')
}

export function getHealth() {
  return apiFetch<{ status?: string }>('/actuator/health')
}
