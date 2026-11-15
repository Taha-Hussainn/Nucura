import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { signIn, logout } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.userType === "admin") navigate("/admin-dashboard", { replace: true });
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      if (!result.success) { setError(result.error); setLoading(false); return; }
      if (result.user.userType !== "admin") {
        await logout();
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }
      setCurrentUser(result.user);
      navigate("/admin-dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md bg-slate-800/40 border border-white/10 rounded-2xl p-8 animate-scale-in">
        <div className="flex flex-col items-center text-center mb-8">
          <img src="/logo-horizontal-white.png" alt="Nucura" className="h-12 w-auto object-contain mb-6" />
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
          <p className="text-slate-400 text-sm mt-1">Authorized personnel only</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input type="email" required placeholder="Admin email" className={inputClass}
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input type={showPassword ? "text" : "password"} required placeholder="Password" className={`${inputClass} pr-11`}
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;