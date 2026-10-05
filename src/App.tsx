import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { RequireAuth } from '@/auth/RequireAuth'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ProfessorHomePage } from '@/pages/ProfessorHomePage'
import { StudentHomePage } from '@/pages/StudentHomePage'

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

      <Route element={<RequireAuth role="PROFESSOR" />}>
        <Route path="/professor" element={<ProfessorHomePage />} />
      </Route>

      <Route element={<RequireAuth role="STUDENT" />}>
        <Route path="/student" element={<StudentHomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
