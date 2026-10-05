export type Role = 'PROFESSOR' | 'STUDENT'

export type SpanishLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: number
  email: string
  fullName: string
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  role: Role
  bio?: string
  specialization?: string
  level?: SpanishLevel
}

export interface ConnectedStudent {
  studentId: number
  email: string
  fullName: string
  level?: string
  connectedAt?: string
}

export interface ConnectedProfessor {
  professorId: number
  email: string
  fullName: string
  connectedAt?: string
}
