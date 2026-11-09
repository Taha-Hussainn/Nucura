import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Users, Heart, Globe, CheckCircle, Calendar, Stethoscope, Building, Target, User, ArrowRight, ChevronDown } from 'lucide-react'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import { specializations, getSpecializationIcon } from '../data/specializations'

const INITIAL_VISIBLE = 12

const features = [
  { icon: <Shield className="h-5 w-5" />, title: 'Doctor Profiles', desc: 'See qualifications, experience and reviews before you book', color: 'bg-blue-50 text-blue-600' },
  { icon: <Calendar className="h-5 w-5" />, title: 'Quick Booking', desc: 'Book appointments in under 2 minutes', color: 'bg-teal-50 text-teal-600' },
  { icon: <Heart className="h-5 w-5" />, title: 'Patient First', desc: 'Designed with patient experience in mind', color: 'bg-sky-50 text-sky-600' },
  { icon: <Users className="h-5 w-5" />, title: 'Direct Chat', desc: 'Message your doctor securely', color: 'bg-indigo-50 text-indigo-600' }
]

const team = [
  { name: 'Dr. Ali Khalid', role: 'Medical Director', icon: <Stethoscope className="h-6 w-6" /> },
  { name: 'Abeer Ahmed', role: 'Operations Head', icon: <Building className="h-6 w-6" /> },
  { name: 'Taha Hussain', role: 'Tech Lead', icon: <Target className="h-6 w-6" /> },
  { name: 'Muhammad Huzaifa', role: 'Patient Care', icon: <User className="h-6 w-6" /> }
]

const milestones = [
  { year: 'Idea', title: 'Concept', desc: 'Started as a healthcare booking idea' },
  { year: 'Build', title: 'Platform', desc: 'Booking, chat, prescriptions and records' },
  { year: 'Launch', title: 'Live', desc: 'Deployed and open for patients and doctors' },
  { year: 'Next', title: 'Growth', desc: 'More cities, payments and a mobile app' }
]

const About = () => {
  const [showAll, setShowAll] = useState(false)
  const visibleSpecs = showAll ? specializations : specializations.slice(0, INITIAL_VISIBLE)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-12 sm:py-16">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 left-1/4 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 animate-fade-up">About <span className="text-teal-200">Nucura</span></h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '150ms' }}>
            Making quality healthcare accessible for everyone in Pakistan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-14 sm:space-y-16">

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <Reveal variant="left">
            <div>
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Story</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Built for Pakistan's Healthcare Needs</h2>
              <p className="text-slate-600 mb-3 leading-relaxed text-sm">
                Nucura started with a simple vision: bridge the gap between patients and healthcare providers across Pakistan.
              </p>
              <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                Our platform makes healthcare accessible and convenient, from finding the right doctor to chat, prescriptions and medical records.
              </p>
              <Link to="/doctors" className="group inline-flex items-center text-blue-600 font-medium text-sm hover:text-blue-700">
                Find a Doctor <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { node: <CountUp value={specializations.length} suffix="+" />, label: 'Specialties', bg: 'bg-blue-600' },
              { node: <span>24/7</span>, label: 'Online Access', bg: 'bg-teal-600' },
              { node: <CountUp value={3} suffix=" min" />, label: 'To Book', bg: 'bg-slate-700' },
              { node: <CountUp value={5} />, label: 'Core Features', bg: 'bg-indigo-600' }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100} variant="scale">
                <div className={`${item.bg} p-5 sm:p-6 rounded-2xl text-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
                  <div className="text-2xl font-bold mb-1">{item.node}</div>
                  <p className="text-sm opacity-80">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Why Nucura</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Sets Us Apart</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-lift h-full">
                  <div className={`inline-flex items-center justify-center w-10 h-10 ${f.color} rounded-xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>{f.icon}</div>
                  <h3 className="font-semibold text-slate-900 mb-1 text-sm">{f.title}</h3>
                  <p className="text-slate-500 text-xs">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Reveal variant="left">
            <div className="bg-blue-600 p-6 sm:p-8 rounded-2xl text-white h-full hover:shadow-xl hover:shadow-blue-200 transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3"><Target className="h-5 w-5" /></div>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </div>
              <p className="text-blue-100 text-sm mb-4">To make quality healthcare accessible, affordable, and convenient for every Pakistani through technology.</p>
              <ul className="space-y-2">
                {['Make healthcare accessible to all', 'Reduce friction through technology', 'Improve patient-doctor relationships'].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-blue-100">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-teal-300 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal variant="up" delay={150}>
            <div className="bg-teal-600 p-6 sm:p-8 rounded-2xl text-white h-full hover:shadow-xl hover:shadow-teal-200 transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3"><Globe className="h-5 w-5" /></div>
                <h3 className="text-xl font-bold">Our Vision</h3>
              </div>
              <p className="text-teal-100 text-sm mb-4">To become Pakistan's most trusted healthcare platform, transforming how care is delivered and experienced.</p>
              <ul className="space-y-2">
                {['Build a nationwide healthcare network', 'Add smarter tools for better outcomes', 'Reach underserved areas'].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-teal-100">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-white flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Team */}
        <div>
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Team</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Team</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {team.map((m, i) => (
              <Reveal key={i} delay={i * 100} variant="scale">
                <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 text-center card-lift h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mb-3 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-teal-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">{m.icon}</div>
                  <h3 className="font-semibold text-slate-900 text-sm">{m.name}</h3>
                  <p className="text-blue-600 text-xs">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Specialties: full list, same source as Home and Find Doctor */}
        <div>
          <Reveal>
            <div className="text-center mb-8">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Specialties</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Medical Specialties</h2>
              <p className="text-slate-500 text-sm mt-2">{specializations.length}+ specialties, tap one to find doctors</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {visibleSpecs.map((name, i) => {
              const Icon = getSpecializationIcon(name)
              return (
                <Link key={name} to={`/doctors?specialization=${encodeURIComponent(name)}`}
                  className="group bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center hover:border-blue-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${Math.min(i, 18) * 30}ms` }}>
                  <div className="inline-flex items-center justify-center w-9 h-9 bg-blue-50 text-blue-600 rounded-lg mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-600 leading-snug">{name}</p>
                </Link>
              )
            })}
          </div>
          {specializations.length > INITIAL_VISIBLE && (
            <div className="text-center mt-6">
              <button onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center px-6 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 active:scale-95 transition">
                {showAll ? 'Show fewer' : `Show all ${specializations.length} specialties`}
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Roadmap */}
        <div>
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Journey</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Roadmap</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-lift h-full">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{m.year}</div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{m.title}</h3>
                  <p className="text-slate-500 text-xs">{m.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Reveal variant="scale">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient rounded-2xl p-6 sm:p-10 text-center">
            <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Join Our Healthcare Platform</h2>
              <p className="text-blue-100 mb-6 text-sm">Whether you're a patient or a doctor, Nucura is built for you.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/signup" className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 active:scale-95 transition-all">Join as Patient</Link>
                <Link to="/signup" className="bg-white/10 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/20 active:scale-95 transition-all">Join as Doctor</Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

export default About