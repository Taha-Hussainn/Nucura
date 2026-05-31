import { Shield, Users, Calendar, CheckCircle, ArrowRight, Stethoscope, Eye, Bone, User, Ear, Pill, Brain, Baby, Heart, Award, Zap, MessageCircle, FileText, Upload, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const specializations = [
    { name: 'Cardiologist', icon: <Heart className="h-6 w-6" />, count: 8 },
    { name: 'Neurologist', icon: <Brain className="h-6 w-6" />, count: 4 },
    { name: 'Pediatrician', icon: <Baby className="h-6 w-6" />, count: 9 },
    { name: 'Dentist', icon: <Stethoscope className="h-6 w-6" />, count: 12 },
    { name: 'Dermatologist', icon: <Shield className="h-6 w-6" />, count: 7 },
    { name: 'Orthopedic', icon: <Bone className="h-6 w-6" />, count: 6 },
    { name: 'Gynecologist', icon: <User className="h-6 w-6" />, count: 11 },
    { name: 'ENT Specialist', icon: <Ear className="h-6 w-6" />, count: 5 },
    { name: 'Psychiatrist', icon: <Brain className="h-6 w-6" />, count: 3 },
    { name: 'Ophthalmologist', icon: <Eye className="h-6 w-6" />, count: 4 },
    { name: 'Gastroenterologist', icon: <Pill className="h-6 w-6" />, count: 4 },
    { name: 'General Physician', icon: <Stethoscope className="h-6 w-6" />, count: 15 },
  ]

  const features = [
    { icon: <Shield className="h-6 w-6" />, title: "Verified Doctors", description: "All doctors are verified with proper credentials and experience", bg: "bg-blue-50", text: "text-blue-600" },
    { icon: <Zap className="h-6 w-6" />, title: "Instant Booking", description: "Simple 3-step booking process completed in under 2 minutes", bg: "bg-teal-50", text: "text-teal-600" },
    { icon: <MessageCircle className="h-6 w-6" />, title: "Direct Chat", description: "Message your doctor directly through our secure chat system", bg: "bg-indigo-50", text: "text-indigo-600" },
    { icon: <FileText className="h-6 w-6" />, title: "Digital Prescriptions", description: "Receive and print digital prescriptions from your doctor", bg: "bg-cyan-50", text: "text-cyan-600" },
    { icon: <Upload className="h-6 w-6" />, title: "Medical Records", description: "Store and access all your medical documents in one place", bg: "bg-sky-50", text: "text-sky-600" },
    { icon: <Award className="h-6 w-6" />, title: "Quality Care", description: "Access to top-rated specialists and premium hospitals", bg: "bg-blue-50", text: "text-blue-600" }
  ]

  const testimonials = [
    { name: "Mahad Hasan", role: "Patient", content: "Found the perfect cardiologist through Nucura. The booking was seamless and the doctor was excellent!", rating: 5, avatar: "MH" },
    { name: "Ayesha Khan", role: "Patient", content: "Emergency appointment booking saved my mother's life. The response time was incredible!", rating: 5, avatar: "AK" },
    { name: "Dr. Ahmed Raza", role: "Cardiologist", content: "Great platform to connect with patients. The management system makes my practice more efficient.", rating: 4, avatar: "AR" }
  ]

  const stats = [
    { value: "85+", label: "Verified Doctors" },
    { value: "1,000+", label: "Happy Patients" },
    { value: "5+", label: "Cities in Pakistan" },
    { value: "4.8", label: "Average Rating" }
  ]

  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-teal-900/30"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-800/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
              <span className="text-blue-200 text-sm font-medium">Pakistan's Trusted Healthcare Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Healthcare Made
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
                Simple & Accessible
              </span>
            </h1>

            <p className="text-lg md:text-xl text-blue-100 opacity-80 mb-10 max-w-2xl leading-relaxed">
              Connect with Pakistan's top verified doctors. Book appointments, consult online,
              manage prescriptions and medical records — all in one secure platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/doctors"
                className="bg-teal-500 hover:bg-teal-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 text-base inline-flex items-center justify-center shadow-lg shadow-teal-500/25">
                Find a Doctor
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link to="/signup"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 text-base inline-flex items-center justify-center">
                Create Free Account
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {['Verified Doctors', 'Instant Booking', '24/7 Support', 'Secure Platform'].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-blue-200 text-sm">
                  <CheckCircle className="h-4 w-4 text-teal-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 50 960 60 720 50C480 40 240 10 0 30Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-1">{stat.value}</div>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Specialties</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Find the Right Specialist</h2>
              <p className="text-slate-500 mt-2 text-base">Browse doctors across 12 medical specialties</p>
            </div>
            <Link to="/doctors" className="mt-4 md:mt-0 inline-flex items-center text-blue-600 font-medium hover:text-blue-700 text-sm">
              View all doctors <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {specializations.map((spec) => (
              <Link key={spec.name} to={`/doctors?specialization=${spec.name.toLowerCase()}`}
                className="group p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 group-hover:bg-white/20 rounded-lg mb-3 mx-auto transition-colors">
                  <div className="text-blue-600 group-hover:text-white transition-colors">{spec.icon}</div>
                </div>
                <h3 className="font-medium text-slate-700 group-hover:text-white text-xs mb-1 transition-colors">{spec.name}</h3>
                <p className="text-slate-400 group-hover:text-blue-100 text-xs transition-colors">{spec.count} Doctors</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">How Nucura Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Get the care you need in three straightforward steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Stethoscope className="h-8 w-8" />, title: "Find Your Doctor", desc: "Search verified specialists, review qualifications and patient ratings.", step: "01" },
              { icon: <Calendar className="h-8 w-8" />, title: "Book Appointment", desc: "Select a convenient date and time slot. Receive instant confirmation.", step: "02" },
              { icon: <CheckCircle className="h-8 w-8" />, title: "Receive Care", desc: "Consult your doctor, receive prescriptions and manage follow-ups.", step: "03" }
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="absolute top-6 right-6 text-5xl font-bold text-slate-100">{item.step}</div>
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Everything in One Platform</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Comprehensive tools for patients and healthcare providers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 group">
                <div className={`inline-flex items-center justify-center w-10 h-10 ${feature.bg} ${feature.text} rounded-lg mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What Our Users Say</h2>
            <p className="text-slate-500">Real experiences from patients and doctors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} onClick={() => setActiveTestimonial(i)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${activeTestimonial === i ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-200' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${activeTestimonial === i ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${activeTestimonial === i ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</h4>
                    <p className={`text-xs ${activeTestimonial === i ? 'text-blue-200' : 'text-slate-500'}`}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`h-3 w-3 ${j < testimonial.rating ? (activeTestimonial === i ? 'text-yellow-300 fill-current' : 'text-yellow-400 fill-current') : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className={`text-sm leading-relaxed ${activeTestimonial === i ? 'text-blue-50' : 'text-slate-600'}`}>"{testimonial.content}"</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'bg-blue-600 w-8' : 'bg-slate-300 w-4'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-3">About Nucura</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Pakistan's Premier Digital Healthcare Platform
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Nucura bridges the gap between patients and top medical professionals across Pakistan.
                Our mission is to make quality healthcare accessible, affordable, and convenient for everyone.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { title: 'Rigorous Doctor Verification', desc: 'Every doctor undergoes thorough background checks and credential verification' },
                  { title: 'Secure & Private Platform', desc: 'Bank-level encryption protects all your health data and communications' },
                  { title: 'Complete Healthcare Management', desc: 'From booking to prescriptions, records and follow-ups in one place' }
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
              <Link to="/about" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 text-sm">
                Learn more about Nucura <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '100%', label: 'Doctor Verification', bg: 'bg-blue-600' },
                { value: '24/7', label: 'Support Available', bg: 'bg-teal-600' },
                { value: '12+', label: 'Medical Specialties', bg: 'bg-slate-700' },
                { value: 'Instant', label: 'Appointment Booking', bg: 'bg-indigo-600' }
              ].map((item, i) => (
                <div key={i} className={`${item.bg} p-8 rounded-2xl text-white`}>
                  <div className="text-2xl font-bold mb-1">{item.value}</div>
                  <p className="text-sm opacity-80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-teal-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join thousands of patients who manage their health with Nucura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg text-base inline-flex items-center justify-center">
              Create Free Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link to="/doctors"
              className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-200 text-base inline-flex items-center justify-center">
              Browse Doctors
            </Link>
          </div>
          <p className="mt-6 text-blue-200 text-sm">No hidden fees • Free registration • 100% secure</p>
        </div>
      </section>
    </div>
  )
}

export default Home