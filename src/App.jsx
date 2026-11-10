import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import DoctorsList from './pages/DoctorsList'
import DoctorProfile from './pages/DoctorProfile'
import BookAppointment from './pages/BookAppointment'
import UserDashboard from './pages/UserDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Contact from './pages/Contact'

const NotFound = () => (
  <div className="max-w-xl mx-auto px-4 py-20 text-center animate-scale-in">
    <p className="text-6xl font-bold text-blue-600 mb-3">404</p>
    <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
    <p className="text-slate-500 text-sm mb-6">The page you are looking for does not exist.</p>
    <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700">
      Back to Home
    </Link>
  </div>
)

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/book-appointment/:doctorId" element={
              <ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['patient']}><UserDashboard /></ProtectedRoute>
            } />
            <Route path="/doctor-dashboard" element={
              <ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App