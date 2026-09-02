import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, UserPlus, Eye, EyeOff } from "lucide-react";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });

      navigate("/login", {
        state: {
          message: "Account created successfully. Please login."
        }
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#8f1d2c] text-white mb-4">
            <Wrench size={28} />
          </div>

          <h1 className="text-3xl font-bold text-[#111827]">
            Create Account
          </h1>

          <p className="text-gray-500 mt-2">
            Join Instant Mechanic Management System
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#8f1d2c] focus:ring-2 focus:ring-[#8f1d2c]/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#8f1d2c] focus:ring-2 focus:ring-[#8f1d2c]/10"
              />
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      placeholder="Minimum 6 characters"
      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#8f1d2c] focus:ring-2 focus:ring-[#8f1d2c]/10"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8f1d2c]"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
    </button>
  </div>
</div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Confirm Password
  </label>

  <div className="relative">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={form.confirmPassword}
      onChange={handleChange}
      placeholder="Re-enter your password"
      className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#8f1d2c] focus:ring-2 focus:ring-[#8f1d2c]/10"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8f1d2c]"
      aria-label={
        showConfirmPassword
          ? "Hide confirm password"
          : "Show confirm password"
      }
    >
      {showConfirmPassword ? (
        <EyeOff size={19} />
      ) : (
        <Eye size={19} />
      )}
    </button>
  </div>
</div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8f1d2c] hover:bg-[#741723] text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />

              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8f1d2c] font-semibold hover:underline"
            >
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}