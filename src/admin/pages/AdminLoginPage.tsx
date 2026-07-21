import { type FormEvent, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Navigate, useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/endpoints";
import { useToast } from "../../components/ui/ToastProvider";
import { useAuth } from "../AuthContext";

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div
      className="relative min-h-screen overflow-hidden bg-charcoal bg-cover bg-center flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "url('https://upload.wikimedia.org/wikipedia/commons/b/b6/RockMemorial.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand/35 via-black/25 to-black/75" />
      <div className="relative w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 backdrop-blur">
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
            <span className="relative block">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 text-base font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent text-charcoal/55 hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </button>
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-brand text-white font-bold rounded-lg border-0 cursor-pointer hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
