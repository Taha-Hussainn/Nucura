import { Link, useNavigate } from 'react-router-dom'
import { UserCircle2, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { logout } from '../api/auth'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { currentUser, setCurrentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  const getDashboardLink = () => {
    if (currentUser?.userType === 'admin') return '/admin-dashboard'
    if (currentUser?.userType === 'doctor') return '/doctor-dashboard'
    return '/dashboard'
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white shadow-md border-b border-slate-100'
        : 'bg-white border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/logo.png"
              alt="Nucura Logo"
              className="h-9 w-9 object-contain rounded-lg"
              style={{ mixBlendMode: 'multiply' }}
            />
            <span className="text-xl font-bold text-blue-700 group-hover:text-blue-600 transition-colors">
              Nucura
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/doctors', label: 'Find Doctor' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' }
            ].map(link => (
              <Link key={link.to} to={link.to}
                className="px-4 py-2 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-150">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-1 text-sm text-slate-500">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  <span className="capitalize">{currentUser.userType}</span>
                </div>
                <Link to={getDashboardLink()}
                  className="flex items-center text-slate-700 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  <UserCircle2 className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-all">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="text-slate-600 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-50">
                  Sign In
                </Link>
                <Link to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-200">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/doctors', label: 'Find Doctor' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' }
            ].map(link => (
              <Link key={link.to} to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all">
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
              {currentUser ? (
                <>
                  <div className="px-4 py-2 text-xs text-slate-400 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    <span>Logged in as <span className="font-medium text-slate-600 capitalize">{currentUser.userType}</span></span>
                  </div>
                  <Link to={getDashboardLink()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all">
                    <UserCircle2 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                    className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-all">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}
                    className="block bg-blue-600 text-white px-4 py-3 rounded-lg text-center text-sm font-semibold hover:bg-blue-700 transition-all">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar