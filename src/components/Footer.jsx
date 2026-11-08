import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ArrowUp, Send, ArrowRight } from 'lucide-react'

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">{children}</svg>
)

// Replace the href values with your real profile links
const socials = [
  {
    name: 'Instagram', href: 'https://instagram.com/your_handle',
    icon: <Icon><path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z"/></Icon>
  },
  {
    name: 'LinkedIn', href: 'https://linkedin.com/in/your_profile',
    icon: <Icon><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 110-4.1 2.1 2.1 0 010 4.1zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></Icon>
  },
  {
    name: 'Facebook', href: 'https://facebook.com/your_page',
    icon: <Icon><path d="M24 12a12 12 0 10-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0024 12z"/></Icon>
  },
  {
    name: 'X', href: 'https://x.com/your_handle',
    icon: <Icon><path d="M18.2 2.3h3.4l-7.4 8.5 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9.1L.9 2.3h7l4.8 6.4 5.5-6.4zm-1.2 18h1.9L6.9 4.2H4.9L17 20.3z"/></Icon>
  },
  {
    name: 'GitHub', href: 'https://github.com/Taha-Hussainn',
    icon: <Icon><path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.500 11.500 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.700.2 2.900.1 3.200.8.8 1.200 1.900 1.200 3.200 0 4.600-2.800 5.600-5.500 5.900.4.400.8 1.100.8 2.200v3.300c0 .3.2.7.8.600A12 12 0 0012 .3z"/></Icon>
  },
]

const useReveal = () => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

const Footer = () => {
  const [ref, visible] = useReveal()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const anim = (delay) => ({
    className: visible ? 'animate-fade-up' : 'opacity-0',
    style: { animationDelay: `${delay}ms` }
  })

  const linkClass =
    'group inline-flex items-center hover:text-white transition-all duration-200 hover:translate-x-1'

  const handleSubscribe = (e) => {
    e.preventDefault()
    // Demo only: no backend yet. Connect to a Supabase table later.
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer ref={ref} className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Animated gradient top line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-teal-400 to-blue-600 animate-gradient" />

      {/* Soft glowing background blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        {/* Newsletter */}
        <div {...anim(0)}>
          <div className={`${anim(0).className} bg-gradient-to-r from-blue-700/40 to-teal-700/40 border border-white/10 rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-5`}>
            <div>
              <h3 className="text-white font-bold text-lg">Stay updated with Nucura</h3>
              <p className="text-slate-400 text-sm mt-1">Health tips and platform updates, straight to your inbox.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input
                type="email" required placeholder="Your email address"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-64 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
              <button type="submit"
                className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-all hover:scale-105 active:scale-95">
                {subscribed ? 'Subscribed!' : <>Subscribe<Send className="h-4 w-4 ml-2" /></>}
              </button>
            </form>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand + socials */}
          <div {...anim(150)}>
            <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
              <img src="/logo.png" alt="Nucura" className="h-9 w-9 object-contain rounded-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
              <span className="text-xl font-bold text-white">Nucura</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Pakistan's digital healthcare platform connecting patients with verified doctors.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s, i) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-teal-500 hover:border-transparent hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
                  style={{ transitionDelay: `${i * 20}ms` }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div {...anim(300)}>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/doctors" className={linkClass}><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-teal-400" />Find a Doctor</Link></li>
              <li><Link to="/signup" className={linkClass}><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-teal-400" />Create Account</Link></li>
              <li><Link to="/login" className={linkClass}><ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-teal-400" />Sign In</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div {...anim(450)}>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['/about', 'About Us'], ['/contact', 'Contact'],
                ['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Service']
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-teal-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div {...anim(600)}>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:support@nucura.com" className="flex items-center hover:text-white transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-teal-500/20 transition-colors">
                    <Mail className="h-4 w-4 text-teal-400" />
                  </span>
                  support@nucura.com
                </a>
              </li>
              <li>
                <a href="tel:+9218001234567" className="flex items-center hover:text-white transition-colors group">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-teal-500/20 transition-colors">
                    <Phone className="h-4 w-4 text-teal-400" />
                  </span>
                  +92 1800-123-4567
                </a>
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mr-3">
                  <MapPin className="h-4 w-4 text-teal-400" />
                </span>
                Karachi, Pakistan
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div {...anim(750)}>
          <div className={`${anim(750).className} border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500`}>
            <p>© {new Date().getFullYear()} Nucura. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="tel:1122" className="flex items-center text-slate-400 hover:text-white transition-colors">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Emergency: 1122
              </a>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all animate-floaty"
                aria-label="Back to top">
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer