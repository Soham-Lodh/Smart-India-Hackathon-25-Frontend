import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, clearStoredUser, storeUser } from "../../lib/api";
import { useToast } from "../ui/toast";

export default function FormPage() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const isSignup = mode === "signup";

  useEffect(() => {
    let mounted = true;

    api
      .getSession()
      .then(({ user }) => {
        if (!mounted) return;
        storeUser(user);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        clearStoredUser();
      })
      .finally(() => {
        if (mounted) setCheckingSession(false);
      });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const switchMode = () => {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = isSignup
        ? { username, email, password }
        : { identifier, password };
      const { user } = isSignup ? await api.signup(payload) : await api.login(payload);
      storeUser(user);
      showToast({
        type: "success",
        title: isSignup ? "Account created" : "Logged in",
        description: `Welcome ${user.username}. Redirecting to your dashboard.`,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
      showToast({
        type: "error",
        title: isSignup ? "Signup failed" : "Login failed",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#fcf8ee] flex items-center justify-center text-sm text-gray-600">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#166700] to-[#0f4d00] text-white flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-6">AgriScan</h1>
        <p className="text-lg leading-relaxed text-green-100">
          Smart cattle identification and agricultural insights powered by AI.
          Track growth, improve profit, and manage livestock with confidence.
        </p>

        <div className="mt-10 space-y-3 text-green-200 text-sm">
          <p>AI Breed Identification</p>
          <p>Economic Growth Analytics</p>
          <p>Farmer Profit Tracking</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-[#fcf8ee] flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              {isSignup
                ? "Sign up to start using your dashboard"
                : "Login with your username or email"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {isSignup ? (
              <>
                <AuthField
                  icon={<UserRound size={17} />}
                  label="Username"
                  value={username}
                  onChange={setUsername}
                  placeholder="Choose a username"
                  autoComplete="username"
                />
                <AuthField
                  icon={<Mail size={17} />}
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </>
            ) : (
              <AuthField
                icon={<UserRound size={17} />}
                label="Username or Email"
                value={identifier}
                onChange={setIdentifier}
                placeholder="Enter username or email"
                autoComplete="username"
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isSignup ? 8 : undefined}
                  placeholder={isSignup ? "Create a strong password" : "Enter your password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#166700] focus:border-[#166700] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#166700] text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-200 hover:bg-[#145c00] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <LoaderCircle size={18} className="animate-spin" />}
              {loading
                ? isSignup
                  ? "Creating account..."
                  : "Signing in..."
                : isSignup
                  ? "Sign Up"
                  : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-[#166700] hover:text-[#0f4d00]"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#166700] focus:border-[#166700] transition"
        />
      </div>
    </div>
  );
}
