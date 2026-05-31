import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Stethoscope, Phone, MapPin } from "lucide-react";
import { signUp } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [userType, setUserType] = useState("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", address: "", specialization: "", experience: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }
    if (formData.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const result = await signUp(formData.email, formData.password, {
        name: formData.name, userType, phone: formData.phone,
        address: formData.address, specialization: formData.specialization, experience: formData.experience
      });
      if (!result.success) { setError(result.error); setLoading(false); return; }
      setCurrentUser(result.user);
      if (userType === "patient") navigate("/dashboard");
      else if (userType === "doctor") navigate("/doctor-dashboard");
      else navigate("/admin-dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-teal-700 flex-col justify-between p-12">
        <div>
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Nucura" className="h-9 w-9 object-contain rounded-lg" style={{ mixBlendMode: 'multiply' }} />
            <span className="text-2xl font-bold text-white">Nucura</span>
          </Link>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">Join Nucura Today</h2>
          <p className="text-blue-100 text-lg">Create your account and take control of your healthcare journey.</p>
          <div className="mt-8 space-y-3">
            {['Book appointments instantly', 'Chat with your doctor', 'Receive digital prescriptions', 'Store medical records securely'].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-blue-100">
                <div className="w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-200 text-sm">© 2024 Nucura. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <img src="/logo.png" alt="Nucura" className="h-8 w-8 object-contain rounded-lg" style={{ mixBlendMode: 'multiply' }} />
            <span className="text-xl font-bold text-blue-700">Nucura</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-8">Join Nucura — it's free</p>

          {/* Type Selector */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-6 bg-slate-100 p-1 gap-1">
            {[
              { key: 'patient', label: 'Patient', icon: <User className="h-4 w-4 mr-1.5" /> },
              { key: 'doctor', label: 'Doctor', icon: <Stethoscope className="h-4 w-4 mr-1.5" /> }
            ].map(t => (
              <button key={t.key} onClick={() => setUserType(t.key)}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  userType === t.key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { name: 'name', type: 'text', placeholder: 'Full name', icon: <User className="h-4 w-4" />, required: true },
              { name: 'email', type: 'email', placeholder: 'Email address', icon: <Mail className="h-4 w-4" />, required: true },
              { name: 'phone', type: 'text', placeholder: 'Phone number', icon: <Phone className="h-4 w-4" />, required: false },
              { name: 'address', type: 'text', placeholder: 'Address', icon: <MapPin className="h-4 w-4" />, required: false },
            ].map(field => (
              <div key={field.name} className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{field.icon}</div>
                <input name={field.name} type={field.type} placeholder={field.placeholder} required={field.required}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData[field.name]} onChange={handleChange} />
              </div>
            ))}

            {userType === "doctor" && (
              <>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input name="specialization" type="text" placeholder="Specialization (e.g. Cardiologist)"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={formData.specialization} onChange={handleChange} />
                </div>
                <input name="experience" type="text" placeholder="Years of experience"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.experience} onChange={handleChange} />
              </>
            )}

            {[
              { name: 'password', placeholder: 'Password (min 6 characters)' },
              { name: 'confirmPassword', placeholder: 'Confirm password' }
            ].map(field => (
              <div key={field.name} className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input name={field.name} type="password" placeholder={field.placeholder} required
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData[field.name]} onChange={handleChange} />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;