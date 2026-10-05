export type Role = 'PROFESSOR' | 'STUDENT'

export type SpanishLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE'

export type NoteKind = 'GENERAL' | 'OBSERVATION' | 'GOAL' | 'HOMEWORK_FEEDBACK'
export type NoteVisibility = 'PRIVATE' | 'SHARED_WITH_STUDENT'

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
  totalPoints?: number
  connectedAt?: string
}

export interface ConnectedProfessor {
  professorId: number
  email: string
  fullName: string
  specialization?: string
  connectedAt?: string
}

export interface NoteDto {
  id: number
  content: string
  kind: NoteKind
  visibility: NoteVisibility
  professorId?: number
  professorFullName?: string
  studentId?: number
  classSessionId?: number
  createdAt?: string
  updatedAt?: string
}

export interface ResourceFileDto {
  id: number
  originalFilename: string
  contentType?: string
  sizeBytes?: number
  uploadedAt?: string
}

export interface ResourceSectionDto {
  id: number
  name: string
  description?: string
  createdAt?: string
  files: ResourceFileDto[]
}

export interface ProfessorResourcesDto {
  professorId: number
  professorFullName: string
  sections: ResourceSectionDto[]
}

export interface HomeworkDto {
  id: number
  title: string
  description?: string
  maxPoints: number
  dueDate?: string
  classSessionId?: number
  classSessionTitle?: string
}

export interface HomeworkSubmissionDto {
  id: number
  homeworkId: number
  studentId: number
  studentEmail: string
  studentFullName: string
  content?: string
  status: string
  grade?: number
  professorFeedback?: string
  submittedAt?: string
  gradedAt?: string
  hasAttachment: boolean
  attachmentOriginalFilename?: string
}

export interface StudentPaymentTrackingDto {
  studentId: number
  studentEmail: string
  studentFullName: string
  paymentReceived: boolean
  prepaidClassCount?: number
  recordedAmount?: number
  note?: string
  updatedAt?: string
}

export interface MyPaymentTrackingDto {
  professorId: number
  professorFullName: string
  paymentReceived: boolean
  prepaidClassCount?: number
  recordedAmount?: number
  note?: string
  updatedAt?: string
}

export interface StudentProgressDto {
  fullName: string
  level: SpanishLevel
  totalPoints: number
  numberOfSubmittedHomework: number
  averageScore: number
}

export interface ClassSession {
  id: number
  title: string
  description?: string
  scheduledAt: string
  durationMinutes: number
  status?: string
  professorId?: number
  professorFullName?: string
  resourceSectionId?: number
  resourceSectionName?: string
  resourceSection?: { id: number; name: string }
  students?: Array<{
    studentId: number
    fullName: string
    email: string
  }>
}

export interface StudentDetailDto {
  id: number
  email: string
  fullName: string
  level: SpanishLevel
  totalPoints: number
  enrolledClassCount: number
  numberOfGradedHomework: number
  averageScore: number
}
