import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { RequireAuth } from '@/auth/RequireAuth'
import { DiscordLayout } from '@/components/DiscordLayout'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { ProfessorHomeChannel } from '@/pages/professor/HomeChannel'
import { RosterChannel } from '@/pages/professor/RosterChannel'
import { StudentProfileChannel } from '@/pages/professor/StudentProfileChannel'
import { ClassesChannel } from '@/pages/professor/ClassesChannel'
import { ResourcesChannel } from '@/pages/professor/ResourcesChannel'
import { NotesChannel } from '@/pages/professor/NotesChannel'
import { PaymentsChannel } from '@/pages/professor/PaymentsChannel'
import { StudentHomeChannel } from '@/pages/student/HomeChannel'
import { ProfessorsChannel } from '@/pages/student/ProfessorsChannel'
import { ProgressChannel } from '@/pages/student/ProgressChannel'
import { HomeworkChannel } from '@/pages/student/HomeworkChannel'
import { StudentClassesChannel } from '@/pages/student/StudentClassesChannel'
import { StudentResourcesChannel } from '@/pages/student/StudentResourcesChannel'
import { StudentNotesChannel } from '@/pages/student/StudentNotesChannel'
import { StudentPaymentsChannel } from '@/pages/student/StudentPaymentsChannel'

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  return (
    <Navigate
      to={user.role === 'PROFESSOR' ? '/professor' : '/student'}
      replace
    />
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<RequireAuth role="PROFESSOR" />}>
        <Route path="/professor" element={<DiscordLayout role="PROFESSOR" />}>
          <Route index element={<ProfessorHomeChannel />} />
          <Route path="roster" element={<RosterChannel />} />
          <Route path="roster/:studentId" element={<StudentProfileChannel />} />
          <Route path="classes" element={<ClassesChannel />} />
          <Route path="resources" element={<ResourcesChannel />} />
          <Route path="notes" element={<NotesChannel />} />
          <Route path="payments" element={<PaymentsChannel />} />
        </Route>
      </Route>

      <Route element={<RequireAuth role="STUDENT" />}>
        <Route path="/student" element={<DiscordLayout role="STUDENT" />}>
          <Route index element={<StudentHomeChannel />} />
          <Route path="professors" element={<ProfessorsChannel />} />
          <Route path="progress" element={<ProgressChannel />} />
          <Route path="classes" element={<StudentClassesChannel />} />
          <Route path="homework" element={<HomeworkChannel />} />
          <Route path="resources" element={<StudentResourcesChannel />} />
          <Route path="notes" element={<StudentNotesChannel />} />
          <Route path="payments" element={<StudentPaymentsChannel />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
