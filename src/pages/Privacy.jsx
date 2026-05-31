const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      items: [
        "Personal information: name, email, phone number, address",
        "Medical information: symptoms, prescriptions, medical records",
        "Usage data: how you interact with our platform",
        "Device information: IP address, browser type, operating system"
      ]
    },
    {
      title: "How We Use Your Information",
      items: [
        "To provide and improve our healthcare services",
        "To facilitate connections between patients and doctors",
        "To send appointment confirmations and reminders",
        "To process payments and maintain records",
        "To ensure platform security and prevent fraud"
      ]
    },
    {
      title: "Data Security",
      items: [
        "All data is encrypted using industry-standard AES-256 encryption",
        "Secure HTTPS connections for all data transmission",
        "Regular security audits and penetration testing",
        "Strict access controls for all staff members",
        "Regular backups to prevent data loss"
      ]
    },
    {
      title: "Sharing Your Information",
      items: [
        "With healthcare providers you book appointments with",
        "With payment processors to handle transactions",
        "When required by law or legal process",
        "We never sell your personal data to third parties",
        "We never share medical data without your explicit consent"
      ]
    },
    {
      title: "Your Rights",
      items: [
        "Access your personal data at any time",
        "Request correction of inaccurate information",
        "Request deletion of your account and data",
        "Export your data in a portable format",
        "Opt out of non-essential communications"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-700 to-teal-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-blue-100">Last updated: January 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
          <p className="text-slate-600 leading-relaxed">
            At Nucura, your privacy is fundamental to everything we do. This Privacy Policy explains how we collect,
            use, and protect your personal and medical information when you use our platform.
            We are committed to transparency and giving you control over your data.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-slate-600 text-sm">
            For privacy concerns or data requests, contact us at{' '}
            <a href="mailto:privacy@nucura.com" className="text-blue-600 font-medium">privacy@nucura.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Privacy