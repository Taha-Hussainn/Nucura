import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Stethoscope, Shield } from "lucide-react";
import { signIn } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [loginType, setLoginType] = useState("patient");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      if (!result.success) { setError(result.error); setLoading(false); return; }
      setCurrentUser(result.user);
      if (result.user.userType === "patient") navigate("/dashboard");
      else if (result.user.userType === "doctor") navigate("/doctor-dashboard");
      else if (result.user.userType === "admin") navigate("/admin-dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const types = [
    { key: "patient", label: "Patient", icon: <User className="h-4 w-4 mr-1.5" /> },
    { key: "doctor", label: "Doctor", icon: <Stethoscope className="h-4 w-4 mr-1.5" /> },
    { key: "admin", label: "Admin", icon: <Shield className="h-4 w-4 mr-1.5" /> }
  ]

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
          <h2 className="text-4xl font-bold text-white mb-4">Welcome back to Nucura</h2>
          <p className="text-blue-100 text-lg">Pakistan's trusted digital healthcare platform connecting patients with verified doctors.</p>
          <div className="mt-8 space-y-3">
            {['Verified healthcare professionals', 'Secure & private platform', 'Instant appointment booking', 'Digital prescriptions & records'].map((item, i) => (
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
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <img src="/logo.png" alt="Nucura" className="h-8 w-8 object-contain rounded-lg" style={{ mixBlendMode: 'multiply' }} />
            <span className="text-xl font-bold text-blue-700">Nucura</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign in to your account</h2>
          <p className="text-slate-500 text-sm mb-8">Access your healthcare portal</p>

          {/* Type Selector */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 mb-6 bg-slate-100 p-1 gap-1">
            {types.map(t => (
              <button key={t.key} onClick={() => setLoginType(t.key)}
                className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  loginType === t.key ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input type="email" required placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input type="password" required placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-slate-300 rounded" />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;