import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const contactInfo = [
    { icon: <Phone className="h-5 w-5" />, title: "Call Us", details: ["+92 1800-123-4567"], description: "24/7 Support", color: "bg-blue-50 text-blue-600" },
    { icon: <Mail className="h-5 w-5" />, title: "Email Us", details: ["support@nucura.com"], description: "Response within 24 hours", color: "bg-teal-50 text-teal-600" },
    { icon: <MapPin className="h-5 w-5" />, title: "Visit Us", details: ["123 Healthcare Street", "Karachi, Pakistan"], description: "Mon-Sat: 9AM-6PM", color: "bg-indigo-50 text-indigo-600" }
  ]

  const faqs = [
    { q: "How do I book an appointment?", a: "Search for a doctor, select a time slot, and fill in your details to book instantly." },
    { q: "Can I cancel my appointment?", a: "Yes, you can cancel up to 24 hours before your appointment through your dashboard." },
    { q: "Are the doctors verified?", a: "All doctors on Nucura are verified with proper credentials, licenses, and experience." },
    { q: "Is my medical information secure?", a: "Yes, we use bank-level encryption to protect all your health data." }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-700 to-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">We're here to help with any questions or concerns about Nucura.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {contactInfo.map((info, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${info.color} rounded-xl mb-4`}>
                {info.icon}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{info.title}</h3>
              {info.details.map((d, j) => <p key={j} className="text-slate-600 text-sm">{d}</p>)}
              <p className="text-slate-400 text-xs mt-2">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
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
              <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-xl text-sm mb-4">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Full Name</label>
                  <input type="text" required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                  <input type="email" required
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Phone</label>
                  <input type="tel"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject</label>
                  <select required className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
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
                <textarea required rows={5}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <button type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3 mb-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="font-semibold text-slate-800 text-sm mb-2">{faq.q}</h3>
                  <p className="text-slate-500 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-red-700 text-sm">Medical Emergency?</h3>
                  <p className="text-red-600 text-xs">Call immediately:</p>
                  <p className="text-2xl font-bold text-red-700">1020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact