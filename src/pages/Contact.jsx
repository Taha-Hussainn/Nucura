import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import Reveal from '../components/Reveal'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Demo only: not saved anywhere yet
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  const contactInfo = [
    { icon: <Phone className="h-5 w-5" />, title: "Call Us", details: ["+92 1800-123-4567"], description: "24/7 Support", color: "bg-blue-50 text-blue-600" },
    { icon: <Mail className="h-5 w-5" />, title: "Email Us", details: ["support@nucura.com"], description: "Response within 24 hours", color: "bg-teal-50 text-teal-600" },
    { icon: <MapPin className="h-5 w-5" />, title: "Visit Us", details: ["123 Healthcare Street", "Karachi, Pakistan"], description: "Mon-Sat: 9AM-6PM", color: "bg-indigo-50 text-indigo-600" }
  ]

  const faqs = [
    { q: "How do I book an appointment?", a: "Search for a doctor, select a time slot, and fill in your details to book instantly." },
    { q: "Can I cancel my appointment?", a: "Yes, you can cancel pending appointments through your dashboard." },
    { q: "Are the doctors verified?", a: "Doctors on Nucura are reviewed by our team before appearing in listings." },
    { q: "Is my medical information secure?", a: "Your data is transmitted over HTTPS and stored with access controls." }
  ]

  const inputClass = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-16">
        <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3 animate-fade-up">Get in Touch</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '150ms' }}>
            We're here to help with any questions or concerns about Nucura.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 -mt-20 relative z-10">
          {contactInfo.map((info, i) => (
            <Reveal key={i} delay={i * 120} variant="scale">
              <div className="group bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-900/5 p-6 text-center card-lift">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${info.color} rounded-xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{info.title}</h3>
                {info.details.map((d, j) => <p key={j} className="text-slate-600 text-sm">{d}</p>)}
                <p className="text-slate-400 text-xs mt-2">{info.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Reveal variant="left">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">Send us a Message</h2>
                  <p className="text-slate-400 text-xs">We'll respond within 24 hours</p>
                </div>
              </div>

              {submitted && (
                <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-xl text-sm mb-4 animate-scale-in">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name</label>
                    <input type="text" required className={inputClass} value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                    <input type="email" required className={inputClass} value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
                    <input type="tel" className={inputClass} value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject</label>
                    <select required className={inputClass} value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                      <option value="">Select</option>
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing Issue</option>
                      <option>Feedback</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Message</label>
                  <textarea required rows={5} className={`${inputClass} resize-none`} value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <button type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition active:scale-[0.98]">
                  Send Message
                </button>
              </form>
            </div>
          </Reveal>

          <div>
            <Reveal variant="fade"><h2 className="font-bold text-slate-900 mb-4">Frequently Asked Questions</h2></Reveal>
            <div className="space-y-3 mb-6">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-lift">
                    <h3 className="font-semibold text-slate-800 text-sm mb-2">{faq.q}</h3>
                    <p className="text-slate-500 text-sm">{faq.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal variant="scale">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <span className="absolute inset-0 rounded-xl bg-red-200 animate-ping opacity-50" />
                    <div className="relative w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-700 text-sm">Medical Emergency?</h3>
                    <p className="text-red-600 text-xs">Call immediately:</p>
                    <p className="text-2xl font-bold text-red-700">1122</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact