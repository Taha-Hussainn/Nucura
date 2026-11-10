import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const homeFor = (type) =>
  type === 'admin' ? '/admin-dashboard' : type === 'doctor' ? '/doctor-dashboard' : '/dashboard'

// UI guard only. The real protection is the database RLS policies.
const ProtectedRoute = ({ roles, children }) => {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(currentUser.userType)) {
    return <Navigate to={homeFor(currentUser.userType)} replace />
  }
  return children
}

export default ProtectedRoute