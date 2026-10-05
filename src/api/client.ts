import { apiFetch } from '@/lib/api'
import type {
  AuthResponse,
  ClassSession,
  ConnectedProfessor,
  ConnectedStudent,
  HomeworkDto,
  HomeworkSubmissionDto,
  LoginRequest,
  MyPaymentTrackingDto,
  NoteDto,
  ProfessorResourcesDto,
  RegisterRequest,
  ResourceSectionDto,
  StudentDetailDto,
  StudentPaymentTrackingDto,
  StudentProgressDto,
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

export function forgotPassword(email: string) {
  return apiFetch<void>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(token: string, newPassword: string) {
  return apiFetch<void>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  })
}

// ─── Professor ───────────────────────────────────────────────

export function listConnectedStudents() {
  return apiFetch<ConnectedStudent[]>('/api/professor/students')
}

export function connectStudentByEmail(email: string) {
  return apiFetch<ConnectedStudent>('/api/professor/students/connect-by-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function disconnectStudent(studentId: number) {
  return apiFetch<void>(`/api/professor/students/${studentId}/connect`, {
    method: 'DELETE',
  })
}

export function getStudentDetail(studentId: number) {
  return apiFetch<StudentDetailDto>(`/api/professor/students/${studentId}`)
}

export function scheduleClass(body: {
  title: string
  description?: string
  scheduledAt: string
  durationMinutes: number
  newResourceSectionName?: string
  resourceSectionId?: number
}) {
  return apiFetch<ClassSession>('/api/professor/classes', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listProfessorClasses(from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const q = params.toString()
  return apiFetch<ClassSession[]>(
    `/api/professor/classes${q ? `?${q}` : ''}`,
  )
}

export function listProfessorResources() {
  return apiFetch<ResourceSectionDto[]>('/api/professor/resources')
}

export function createResourceSection(name: string, description?: string) {
  return apiFetch<ResourceSectionDto>('/api/professor/resources/sections', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  })
}

export function listStudentNotes(studentId: number) {
  return apiFetch<NoteDto[]>(`/api/professor/students/${studentId}/notes`)
}

export function addStudentNote(
  studentId: number,
  body: {
    content: string
    kind?: string
    visibility?: string
    classSessionId?: number
  },
) {
  return apiFetch<NoteDto>(`/api/professor/students/${studentId}/notes`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listPaymentTracking() {
  return apiFetch<StudentPaymentTrackingDto[]>('/api/professor/payment-tracking')
}

export function listHomeworkForClass(classId: number) {
  return apiFetch<HomeworkDto[]>(`/api/professor/classes/${classId}/homework`)
}

export function createHomework(
  classId: number,
  body: {
    title: string
    description?: string
    dueDate: string
    maxPoints: number
  },
) {
  return apiFetch<HomeworkDto>(`/api/professor/classes/${classId}/homework`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listHomeworkSubmissions(homeworkId: number) {
  return apiFetch<HomeworkSubmissionDto[]>(
    `/api/professor/homework/${homeworkId}/submissions`,
  )
}

export function gradeSubmission(
  submissionId: number,
  body: { grade: number; feedback?: string },
) {
  return apiFetch<HomeworkSubmissionDto>(
    `/api/professor/submissions/${submissionId}/grade`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
  )
}

// ─── Student ─────────────────────────────────────────────────

export function listMyProfessors() {
  return apiFetch<ConnectedProfessor[]>('/api/student/professors')
}

export function getStudentProgress() {
  return apiFetch<StudentProgressDto>('/api/student/progress')
}

export function listSharedNotes() {
  return apiFetch<NoteDto[]>('/api/student/notes')
}

export function listStudentResources() {
  return apiFetch<ProfessorResourcesDto[]>('/api/student/resources')
}

export function listPendingHomework() {
  return apiFetch<HomeworkDto[]>('/api/student/homework')
}

export function listStudentClasses(from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const q = params.toString()
  return apiFetch<ClassSession[]>(`/api/student/classes${q ? `?${q}` : ''}`)
}

export function listMyPaymentTracking() {
  return apiFetch<MyPaymentTrackingDto[]>('/api/student/payment-tracking')
}

export function submitHomework(homeworkId: number, content: string) {
  return apiFetch<unknown>(`/api/student/homework/${homeworkId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
