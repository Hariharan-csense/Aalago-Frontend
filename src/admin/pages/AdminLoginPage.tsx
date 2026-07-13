import { type FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/endpoints";
import { useToast } from "../../components/ui/ToastProvider";
import { useAuth } from "../AuthContext";

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@aalago.in");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      login(res.token, res.user);
      showToast("Welcome back!", "success");
      navigate("/admin");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <p className="text-2xl font-extrabold text-center mb-1">
          <span className="text-brand">aala</span>GO
        </p>
        <p className="text-center text-charcoal/60 text-sm mb-8">Admin Login</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-lg border border-gray-200 text-base font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 rounded-lg border border-gray-200 text-base font-normal"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-charcoal/40 text-center mt-6">
          Default: admin@aalago.in / admin123
        </p>
      </div>
    </div>
  );
}
