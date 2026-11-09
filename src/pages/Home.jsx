import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Users, Calendar, CheckCircle, ArrowRight, Stethoscope, Zap, MessageCircle, FileText, Upload, Award, Star, Search, ChevronDown } from 'lucide-react'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import { fetchDoctors } from '../api/doctors'
import { specializations as baseSpecs, getSpecializationIcon } from '../data/specializations'

const INITIAL_VISIBLE = 18

const features = [
  { icon: <Shield className="h-6 w-6" />, title: 'Doctor Profiles', description: 'See qualifications, experience, fees and patient reviews before you book', bg: 'bg-blue-50', text: 'text-blue-600' },
  { icon: <Zap className="h-6 w-6" />, title: 'Instant Booking', description: 'Simple 3-step booking process completed in minutes', bg: 'bg-teal-50', text: 'text-teal-600' },
  { icon: <MessageCircle className="h-6 w-6" />, title: 'Direct Chat', description: 'Message your doctor through our secure real-time chat', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { icon: <FileText className="h-6 w-6" />, title: 'Digital Prescriptions', description: 'Receive and print prescriptions straight from your dashboard', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { icon: <Upload className="h-6 w-6" />, title: 'Medical Records', description: 'Store reports and scans safely in one place', bg: 'bg-sky-50', text: 'text-sky-600' },
  { icon: <Award className="h-6 w-6" />, title: 'Patient Reviews', description: 'Read honest ratings and reviews from real patients', bg: 'bg-blue-50', text: 'text-blue-600' }
]

const steps = [
  { icon: <Stethoscope className="h-8 w-8" />, title: 'Find Your Doctor', desc: 'Search by specialty or city, and compare qualifications and patient ratings.', step: '01' },
  { icon: <Calendar className="h-8 w-8" />, title: 'Book Appointment', desc: 'Pick a convenient date and time slot and get your booking right away.', step: '02' },
  { icon: <CheckCircle className="h-8 w-8" />, title: 'Receive Care', desc: 'Consult your doctor, chat, get prescriptions and manage follow-ups.', step: '03' }
]

// Sample content: replace with real patient feedback once you have it
const testimonials = [
  { name: 'Mahad Hasan', role: 'Patient', content: 'Found the right cardiologist through Nucura. The booking was seamless and the doctor was excellent!', rating: 5, avatar: 'MH' },
  { name: 'Ayesha Khan', role: 'Patient', content: 'Booking an appointment and chatting with the doctor from one place saved me a lot of time.', rating: 5, avatar: 'AK' },
  { name: 'Dr. Ahmed Raza', role: 'Cardiologist', content: 'Great platform to connect with patients. The dashboard makes managing appointments much easier.', rating: 4, avatar: 'AR' }
]

const Home = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [query, setQuery] = useState('')
  const [heroSpec, setHeroSpec] = useState('')
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    fetchDoctors().then(({ data }) => setDoctors(data))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  const countsBySpec = useMemo(() => {
    const map = {}
    doctors.forEach(d => {
      const key = (d.specialization || '').toLowerCase()
      if (key) map[key] = (map[key] || 0) + 1
    })
    return map
  }, [doctors])

  // Full specialty list + any custom ones from the database; specialties with doctors come first
  const specList = useMemo(() => {
    const seen = new Set()
    const merged = []
    ;[...baseSpecs, ...doctors.map(d => d.specialization).filter(Boolean)].forEach(s => {
      const key = s.toLowerCase()
      if (!seen.has(key)) { seen.add(key); merged.push(s) }
    })
    return merged.sort((a, b) =>
      (countsBySpec[b.toLowerCase()] || 0) - (countsBySpec[a.toLowerCase()] || 0) || a.localeCompare(b)
    )
  }, [doctors, countsBySpec])

  const cityCount = useMemo(
    () => new Set(doctors.map(d => (d.location || '').split(',')[0].trim()).filter(Boolean)).size,
    [doctors]
  )

  const matches = specList.filter(s => s.toLowerCase().includes(query.trim().toLowerCase()))
  const visible = query || showAll ? matches : matches.slice(0, INITIAL_VISIBLE)

  const specLink = (name) => `/doctors?specialization=${encodeURIComponent(name)}`

  const handleHeroSearch = (e) => {
    e.preventDefault()
    navigate(heroSpec ? specLink(heroSpec) : '/doctors')
  }

  const liveStats = [
    { node: <CountUp value={doctors.length} />, label: 'Doctors' },
    { node: <CountUp value={specList.length} />, label: 'Specialties' },
    { node: <CountUp value={cityCount} />, label: 'Cities' }
  ]

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-teal-800 animate-gradient min-h-[85vh] sm:min-h-[92vh] flex items-center">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-60"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="animate-fade-up inline-flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                </span>
                <span className="text-blue-100 text-sm font-medium">Digital healthcare for Pakistan</span>
              </div>

              <h1 className="animate-fade-up text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ animationDelay: '100ms' }}>
                Healthcare Made
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">Simple & Accessible</span>
              </h1>

              <p className="animate-fade-up text-lg md:text-xl text-blue-100/80 mb-8 max-w-xl leading-relaxed" style={{ animationDelay: '200ms' }}>
                Find doctors across every specialty, book appointments, chat with your doctor and manage prescriptions and records in one place.
              </p>

              <form onSubmit={handleHeroSearch}
                className="animate-fade-up flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2 shadow-2xl shadow-blue-950/30 max-w-xl mb-10"
                style={{ animationDelay: '300ms' }}>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select value={heroSpec} onChange={(e) => setHeroSpec(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl text-sm text-slate-700 bg-transparent focus:outline-none">
                    <option value="">All specialties</option>
                    {specList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button type="submit"
                  className="group bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center justify-center active:scale-95 transition">
                  Find Doctors
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="animate-fade-up flex gap-6 sm:gap-10" style={{ animationDelay: '450ms' }}>
                {liveStats.map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-white">{s.node}</div>
                    <p className="text-blue-200 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating glass cards */}
            <div className="hidden lg:flex flex-col items-end gap-5 pr-6">
              {[
                { icon: <CheckCircle className="h-5 w-5" />, title: 'Appointment confirmed', sub: 'Tomorrow, 10:30 AM', delay: '0.3s', offset: '' },
                { icon: <MessageCircle className="h-5 w-5" />, title: 'New message from doctor', sub: 'Your reports look good', delay: '0.5s', offset: 'mr-12' },
                { icon: <FileText className="h-5 w-5" />, title: 'Prescription ready', sub: 'View and print anytime', delay: '0.7s', offset: '' }
              ].map((card, i) => (
                <div key={i} className={`animate-fade-up ${card.offset}`} style={{ animationDelay: card.delay }}>
                  <div className="animate-floaty bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4 flex items-center gap-4 w-72 shadow-xl"
                    style={{ animationDelay: `-${i * 1.2}s` }}>
                    <div className="w-10 h-10 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center flex-shrink-0">{card.icon}</div>
                    <div>
                      <p className="text-white text-sm font-semibold">{card.title}</p>
                      <p className="text-blue-200 text-xs">{card.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 50 960 60 720 50C480 40 240 10 0 30Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Specialties</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Find the Right Specialist</h2>
                <p className="text-slate-500 mt-2">Browse {specList.length}+ medical specialties</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search specialty..."
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
          </Reveal>

          <Reveal variant="fade">
            {visible.length === 0 ? (
              <p className="text-center text-slate-400 py-10 text-sm">No specialty found for "{query}"</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {visible.map((name, i) => {
                  const Icon = getSpecializationIcon(name)
                  const count = countsBySpec[name.toLowerCase()] || 0
                  const isExtra = i >= INITIAL_VISIBLE
                  return (
                    <Link key={name} to={specLink(name)}
                      className={`group p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 text-center ${isExtra ? 'animate-scale-in' : ''}`}
                      style={isExtra ? { animationDelay: `${Math.min(i - INITIAL_VISIBLE, 24) * 25}ms` } : undefined}>
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 group-hover:bg-white/20 rounded-lg mb-3 mx-auto transition-colors">
                        <Icon className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-medium text-slate-700 group-hover:text-white text-xs mb-1 transition-colors leading-snug">{name}</h3>
                      <p className={`text-xs transition-colors ${count > 0 ? 'text-teal-600 group-hover:text-blue-100 font-medium' : 'text-slate-400 group-hover:text-blue-100'}`}>
                        {count > 0 ? `${count} Doctor${count > 1 ? 's' : ''}` : 'Coming soon'}
                      </p>
                    </Link>
                  )
                })}
              </div>
            )}
          </Reveal>

          {!query && matches.length > INITIAL_VISIBLE && (
            <div className="text-center mt-8">
              <button onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center px-6 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 active:scale-95 transition">
                {showAll ? 'Show fewer' : `Show all ${matches.length} specialties`}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Process</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How Nucura Works</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Get the care you need in three straightforward steps</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, i) => (
              <Reveal key={i} delay={i * 150} variant="scale">
                <div className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="absolute top-6 right-6 text-5xl font-bold text-slate-100 group-hover:text-blue-100 transition-colors">{item.step}</div>
                  <div className="w-14 h-14 bg-blue-600 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-teal-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Features</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Everything in One Platform</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Tools for both patients and healthcare providers</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={i} delay={(i % 3) * 100}>
                <div className="group p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-11 h-11 ${f.bg} ${f.text} rounded-lg mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Testimonials</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What Our Users Say</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 120} variant="scale">
                <div onClick={() => setActiveTestimonial(i)}
                  className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer h-full ${
                    activeTestimonial === i
                      ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200 -translate-y-2'
                      : 'bg-white border-slate-100 hover:border-blue-200'
                  }`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${activeTestimonial === i ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>{t.avatar}</div>
                    <div>
                      <h4 className={`font-semibold text-sm ${activeTestimonial === i ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                      <p className={`text-xs ${activeTestimonial === i ? 'text-blue-200' : 'text-slate-500'}`}>{t.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`h-3 w-3 ${j < t.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className={`text-sm leading-relaxed ${activeTestimonial === i ? 'text-blue-50' : 'text-slate-600'}`}>"{t.content}"</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} aria-label={`Testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'bg-blue-600 w-8' : 'bg-slate-300 w-4'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal variant="left">
              <div>
                <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3">About Nucura</p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Pakistan's Digital Healthcare Platform</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  Nucura bridges the gap between patients and medical professionals. Our mission is to make quality healthcare accessible, affordable and convenient for everyone.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    { title: 'Every Specialty', desc: 'From general physicians to rare sub-specialists, find the right doctor' },
                    { title: 'Secure & Private', desc: 'Your data is transmitted over HTTPS and stored with access controls' },
                    { title: 'Complete Management', desc: 'Booking, chat, prescriptions and records in one place' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                        <p className="text-slate-500 text-sm mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/about" className="group inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm">
                  Learn more about Nucura <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-4">
              {[
                { node: <CountUp value={doctors.length} />, label: 'Doctors', bg: 'bg-blue-600' },
                { node: <CountUp value={specList.length} />, label: 'Specialties', bg: 'bg-teal-600' },
                { node: <CountUp value={cityCount} />, label: 'Cities', bg: 'bg-slate-700' },
                { node: <span>24/7</span>, label: 'Online Access', bg: 'bg-indigo-600' }
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100} variant="scale">
                  <div className={`${item.bg} p-8 rounded-2xl text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
                    <div className="text-3xl font-bold mb-1">{item.node}</div>
                    <p className="text-sm opacity-80">{item.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <Reveal variant="scale">
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg mb-10">Create a free account and book your first appointment today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup"
                className="group bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg inline-flex items-center justify-center">
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/doctors"
                className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center justify-center">
                Browse Doctors
              </Link>
            </div>
            <p className="mt-6 text-blue-200 text-sm">Free registration • Secure platform</p>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

export default Home