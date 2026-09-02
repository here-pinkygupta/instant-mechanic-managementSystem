import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Wrench } from "lucide-react";
import api from "../api/api";
import { Link } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", form);

      const data = response.data;

      const token =
        data.token ||
        data.data?.token ||
        data.accessToken ||
        data.data?.accessToken;

      const user = data.user || data.data?.user;

      if (!token) {
        throw new Error("Token was not returned by the server");
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/dashboard");
    } catch (err) {
  const data = err?.response?.data;

  const message =
    typeof data?.message === "string"
      ? data.message
      : typeof data?.error?.message === "string"
        ? data.error.message
        : typeof data?.error === "string"
          ? data.error
          : "Invalid email or password";

  setError(message);
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111827]">
      <div className="hidden flex-1 items-center justify-center lg:flex">
        <div className="max-w-md text-white">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8f1d2c]">
            <Wrench size={30} />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Instant
            <br />
            Mechanic
          </h1>

          <p className="mt-5 text-gray-400">
            A simple management platform for customers,
            mechanics, services and bookings.
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-[#f5f6f8] p-6 lg:max-w-xl">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#111827]">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sign in to your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#8f1d2c] focus:ring-2 focus:ring-[#8f1d2c]/10"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-[#8f1d2c] focus:ring-2 focus:ring-[#8f1d2c]/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-lg bg-[#8f1d2c] py-3 font-semibold text-white transition hover:bg-[#751622] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center mt-6 text-sm text-gray-500">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="text-[#8f1d2c] font-semibold hover:underline"
  >
    Create an account
  </Link>
</div>

{error && (
  <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
    {error}
  </div>
)}
          </form>
        </div>
      </div>
    </div>
  );
}