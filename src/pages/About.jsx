import { Shield, Users, Clock, Heart, Award, Globe, CheckCircle, Phone, Mail, MapPin, Calendar, Stethoscope, Building, Target, User, Brain, Baby, Bone, Eye, Ear, Pill, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const About = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000) }

  const features = [
    { icon: <Shield className="h-5 w-5" />, title: "Verified Doctors", desc: "All doctors undergo rigorous verification", color: "bg-blue-50 text-blue-600" },
    { icon: <Calendar className="h-5 w-5" />, title: "Quick Booking", desc: "Book appointments in under 2 minutes", color: "bg-teal-50 text-teal-600" },
    { icon: <Heart className="h-5 w-5" />, title: "Patient First", desc: "Designed with patient experience in mind", color: "bg-red-50 text-red-500" },
    { icon: <Users className="h-5 w-5" />, title: "24/7 Support", desc: "Round-the-clock customer support", color: "bg-indigo-50 text-indigo-600" }
  ]

  const team = [
    { name: "Dr. Ali Khalid", role: "Medical Director", exp: "20+ years", icon: <Stethoscope className="h-6 w-6" /> },
    { name: "Abeer Ahmed", role: "Operations Head", exp: "10+ years", icon: <Building className="h-6 w-6" /> },
    { name: "Taha Hussain", role: "Tech Lead", exp: "8+ years", icon: <Target className="h-6 w-6" /> },
    { name: "Muhammad Huzaifa", role: "Patient Care", exp: "6+ years", icon: <User className="h-6 w-6" /> }
  ]

  const milestones = [
    { year: "2020", title: "Founded", desc: "Started with 50 doctors in Karachi" },
    { year: "2021", title: "Expanded", desc: "Launched in 5 major cities" },
    { year: "2022", title: "1K+ Users", desc: "Reached major milestones" },
    { year: "2023", title: "Award Won", desc: "Best Healthcare Startup Award" },
    { year: "2024", title: "Growing", desc: "Expanding across Pakistan" }
  ]

  const specializations = [
    { icon: <Heart className="h-5 w-5" />, name: "Cardiology" },
    { icon: <Brain className="h-5 w-5" />, name: "Neurology" },
    { icon: <Baby className="h-5 w-5" />, name: "Pediatrics" },
    { icon: <Bone className="h-5 w-5" />, name: "Orthopedics" },
    { icon: <Eye className="h-5 w-5" />, name: "Ophthalmology" },
    { icon: <Ear className="h-5 w-5" />, name: "ENT" },
    { icon: <Pill className="h-5 w-5" />, name: "Gastroenterology" },
    { icon: <Shield className="h-5 w-5" />, name: "Dermatology" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">About <span className="text-teal-200">Nucura</span></h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">We're on a mission to make quality healthcare accessible for everyone in Pakistan.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Our Story</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Built for Pakistan's Healthcare Needs</h2>
            <p className="text-slate-600 mb-3 leading-relaxed text-sm">Founded in 2020, Nucura started with a simple vision: to bridge the gap between patients and healthcare providers across Pakistan.</p>
            <p className="text-slate-600 mb-3 leading-relaxed text-sm">We've grown to serve thousands of patients, connecting them with verified doctors across multiple cities. Our platform makes healthcare accessible, affordable, and convenient.</p>
            <Link to="/doctors" className="inline-flex items-center text-blue-600 font-medium text-sm hover:text-blue-700">
              Find a Doctor <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '85+', label: 'Verified Doctors', bg: 'bg-blue-600' },
              { value: '1K+', label: 'Happy Patients', bg: 'bg-teal-600' },
              { value: '5+', label: 'Cities', bg: 'bg-slate-700' },
              { value: '4.8★', label: 'Average Rating', bg: 'bg-indigo-600' }
            ].map((item, i) => (
              <div key={i} className={`${item.bg} p-6 rounded-2xl text-white`}>
                <div className="text-2xl font-bold mb-1">{item.value}</div>
                <p className="text-sm opacity-80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="text-center mb-10">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Why Nucura</p>
            <h2 className="text-3xl font-bold text-slate-900">What Sets Us Apart</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className={`inline-flex items-center justify-center w-10 h-10 ${f.color} rounded-xl mb-3`}>{f.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-1 text-sm">{f.title}</h3>
                <p className="text-slate-500 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-blue-600 p-8 rounded-2xl text-white">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
            </div>
            <p className="text-blue-100 text-sm mb-4">To make quality healthcare accessible, affordable, and convenient for every Pakistani through technology.</p>
            <ul className="space-y-2">
              {['Make healthcare accessible to all', 'Reduce costs through technology', 'Improve patient-doctor relationships'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-blue-100">
                  <CheckCircle className="h-4 w-4 mr-2 text-teal-300 flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-teal-600 p-8 rounded-2xl text-white">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Our Vision</h3>
            </div>
            <p className="text-teal-100 text-sm mb-4">To become Pakistan's most trusted healthcare platform, transforming how healthcare is delivered and experienced.</p>
            <ul className="space-y-2">
              {["Build Pakistan's largest healthcare network", 'Integrate AI for better outcomes', 'Expand to rural and underserved areas'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-teal-100">
                  <CheckCircle className="h-4 w-4 mr-2 text-white flex-shrink-0" />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-10">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Team</p>
            <h2 className="text-3xl font-bold text-slate-900">Our Leadership</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-blue-600 rounded-xl mb-3">{member.icon}</div>
                <h3 className="font-semibold text-slate-900 text-sm">{member.name}</h3>
                <p className="text-blue-600 text-xs mb-1">{member.role}</p>
                <p className="text-slate-400 text-xs">{member.exp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Medical Specialties</h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {specializations.map((spec, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center hover:border-blue-200 transition-colors">
                <div className="inline-flex items-center justify-center w-9 h-9 bg-blue-50 text-blue-600 rounded-lg mb-2">{spec.icon}</div>
                <p className="text-xs font-medium text-slate-600">{spec.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center mb-10">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Journey</p>
            <h2 className="text-3xl font-bold text-slate-900">Our Milestones</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {milestones.map((m, i) => (
              <div key={i} className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="text-2xl font-bold text-blue-600 mb-1">{m.year}</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{m.title}</h3>
                <p className="text-slate-500 text-xs">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-700 to-teal-700 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Join Our Healthcare Revolution</h2>
          <p className="text-blue-100 mb-6 text-sm">Whether you're a patient or a doctor, Nucura is built for you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-50 transition">
              Join as Patient
            </Link>
            <Link to="/signup" className="bg-white/10 border border-white/30 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition">
              Join as Doctor
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About