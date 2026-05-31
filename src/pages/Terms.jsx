const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using Nucura's platform, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
    },
    {
      title: "2. Use of Services",
      content: "Nucura provides a digital healthcare platform connecting patients with verified medical professionals. Our services include appointment booking, digital consultations, prescription management, and medical records storage."
    },
    {
      title: "3. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating your account and to update this information as necessary."
    },
    {
      title: "4. Medical Disclaimer",
      content: "Nucura is a platform that facilitates connections between patients and healthcare providers. We do not provide medical advice. Always consult a qualified healthcare professional for medical decisions."
    },
    {
      title: "5. Privacy & Data",
      content: "We collect and process personal and medical data in accordance with our Privacy Policy. Your health data is encrypted and stored securely. We do not sell your personal information to third parties."
    },
    {
      title: "6. Appointments & Cancellations",
      content: "Appointments booked through Nucura are subject to availability. Please cancel appointments at least 24 hours in advance. Repeated no-shows may result in account restrictions."
    },
    {
      title: "7. Limitation of Liability",
      content: "Nucura shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or services. Our liability is limited to the amount paid for services."
    },
    {
      title: "8. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the new terms. We will notify users of significant changes via email."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-blue-700 to-teal-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-blue-100">Last updated: January 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-6">
          <p className="text-slate-600 leading-relaxed">
            Welcome to Nucura. Please read these Terms of Service carefully before using our platform.
            These terms govern your use of our services and constitute a legally binding agreement between you and Nucura.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-slate-600 text-sm">
            For questions about these terms, contact us at{' '}
            <a href="mailto:legal@nucura.com" className="text-blue-600 font-medium">legal@nucura.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Terms