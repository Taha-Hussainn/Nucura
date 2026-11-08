import Reveal from '../components/Reveal'

const sections = [
  { title: "Information We Collect", items: [
    "Personal information: name, email, phone number, address",
    "Medical information: symptoms, prescriptions, medical records",
    "Usage data: how you interact with our platform",
    "Device information: IP address, browser type, operating system"
  ]},
  { title: "How We Use Your Information", items: [
    "To provide and improve our healthcare services",
    "To facilitate connections between patients and doctors",
    "To send appointment confirmations and reminders",
    "To ensure platform security and prevent fraud"
  ]},
  { title: "Data Security", items: [
    "Secure HTTPS connections for all data transmission",
    "Access controls on stored data and files",
    "Passwords are never stored in plain text",
    "Regular backups to prevent data loss"
  ]},
  { title: "Sharing Your Information", items: [
    "With healthcare providers you book appointments with",
    "When required by law or legal process",
    "We never sell your personal data to third parties",
    "We never share medical data without your consent"
  ]},
  { title: "Your Rights", items: [
    "Access your personal data at any time",
    "Request correction of inaccurate information",
    "Request deletion of your account and data",
    "Opt out of non-essential communications"
  ]}
]

const Check = () => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const Privacy = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-teal-600 to-blue-700 animate-gradient py-16">
      <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-white mb-3 animate-slide-left">Privacy Policy</h1>
        <p className="text-blue-100 animate-slide-left" style={{ animationDelay: '120ms' }}>Last updated: {new Date().getFullYear()}</p>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Reveal>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
          <p className="text-slate-600 leading-relaxed">
            At Nucura, your privacy is fundamental. This policy explains how we collect, use, and protect your
            personal and medical information when you use our platform.
          </p>
        </div>
      </Reveal>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <Reveal key={i} delay={(i % 3) * 80}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 card-lift">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{s.title}</h2>
              <ul className="space-y-2">
                {s.items.map((item, j) => (
                  <li key={j} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Check /></div>
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-slate-600 text-sm">
            Privacy concerns or data requests? Contact{' '}
            <a href="mailto:privacy@nucura.com" className="text-blue-600 font-medium hover:underline">privacy@nucura.com</a>
          </p>
        </div>
      </Reveal>
    </div>
  </div>
)

export default Privacy