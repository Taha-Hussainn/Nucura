import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="Nucura" className="h-8 w-8 object-contain rounded-lg" />
              <span className="text-xl font-bold text-white">Nucura</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pakistan's digital healthcare platform connecting patients with verified doctors.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/doctors" className="hover:text-white transition-colors">Find a Doctor</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center"><Mail className="h-4 w-4 mr-2 text-teal-400" />support@nucura.com</li>
              <li className="flex items-center"><Phone className="h-4 w-4 mr-2 text-teal-400" />+92 1800-123-4567</li>
              <li className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-teal-400" />Karachi, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nucura. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Emergency? Call 1122</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer