import Reveal from '../components/Reveal'

const sections = [
  { title: "1. Acceptance of Terms", content: "By accessing and using Nucura's platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
  { title: "2. Use of Services", content: "Nucura provides a digital healthcare platform connecting patients with verified medical professionals. Our services include appointment booking, digital consultations, prescription management, and medical records storage." },
  { title: "3. User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating your account and to update this information as necessary." },
  { title: "4. Medical Disclaimer", content: "Nucura is a platform that facilitates connections between patients and healthcare providers. We do not provide medical advice. Always consult a qualified healthcare professional for medical decisions." },
  { title: "5. Privacy & Data", content: "We collect and process personal and medical data in accordance with our Privacy Policy. We do not sell your personal information to third parties." },
  { title: "6. Appointments & Cancellations", content: "Appointments booked through Nucura are subject to availability. Please cancel appointments at least 24 hours in advance. Repeated no-shows may result in account restrictions." },
  { title: "7. Limitation of Liability", content: "Nucura shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or services." },
  { title: "8. Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the new terms." }
]

const Terms = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-16">
      <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-3 animate-slide-left">Terms of Service</h1>
        <p className="text-blue-100 animate-slide-left" style={{ animationDelay: '120ms' }}>Last updated: {new Date().getFullYear()}</p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
          <p className="text-slate-600 leading-relaxed">
            Welcome to Nucura. Please read these Terms of Service carefully before using our platform.
            These terms govern your use of our services and constitute a legally binding agreement between you and Nucura.
          </p>
        </div>
      </Reveal>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <Reveal key={i} delay={(i % 3) * 80}>
            <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 card-lift relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-600 to-teal-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
              <h2 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{s.content}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-slate-600 text-sm">
            Questions about these terms? Contact{' '}
            <a href="mailto:legal@nucura.com" className="text-blue-600 font-medium hover:underline">legal@nucura.com</a>
          </p>
        </div>
      </Reveal>
    </div>
  </div>
)

export default Terms