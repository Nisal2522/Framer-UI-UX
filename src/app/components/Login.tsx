import { useNavigate } from "react-router";
import { Lock, Mail, ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import backgroundImage from "../../assets/background.png";
import faoLogo from "../../assets/fao.jpg";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Agricultural landscape"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-[#021030]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021030]/60 via-transparent to-[#021030]/40" />
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/8 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
      </div>

      {/* Center - Login card */}
      <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-[460px] rounded-3xl bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex items-center gap-3.5 mb-8">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-lg shadow-blue-500/20 bg-white/10 p-1">
              <img
                src={faoLogo}
                alt="FAO logo"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                FOMMP
              </h1>
              <p className="text-[10px] text-blue-200/70 font-medium tracking-wider uppercase">
                Management Platform
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Welcome back
            </h2>
            <p className="text-sm text-blue-100/60 mt-1.5">
              Sign in to manage your cooperative
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-blue-100/80">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/40 group-focus-within:text-blue-300 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-xl text-white placeholder-blue-200/30 focus:bg-white/[0.1] focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-blue-100/80">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/40 group-focus-within:text-blue-300 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-xl text-white placeholder-blue-200/30 focus:bg-white/[0.1] focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-blue-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400/30 focus:ring-offset-0"
                />
                <span className="text-sm text-blue-100/60">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-300/70 hover:text-blue-200 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="group relative w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-base hover:from-blue-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              Sign In
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-[11px] text-blue-200/40">
                Supported by FAO & PEARL Project
              </span>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 text-blue-200/35">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[11px]">Secured with end-to-end encryption</span>
          </div>

          {/* Footer */}
          <div className="mt-5 text-center space-y-0.5">
            <p className="text-[11px] text-blue-200/30">
              © 2026 Control Union Inspections (Pvt) Ltd
            </p>
            <p className="text-[10px] text-blue-200/25">
              For MAFF, GDA, DACP & Development Partners
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Feature showcase (visible on xl+) */}
      <div className="hidden xl:flex flex-1 items-center justify-center relative z-10 p-12">
        <div className="max-w-md text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.1]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-blue-100/80 font-medium">
              Empowering Agricultural Communities
            </span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight">
            Farmer Organizations
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              Management Platform
            </span>
          </h2>

          <p className="text-base text-blue-100/50 leading-relaxed">
            Streamline cooperative management, track member profiles, monitor land records, and generate comprehensive reports.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 pt-2">
            {[
              { value: "447+", label: "Members" },
              { value: "1.2K", label: "Hectares" },
              { value: "15+", label: "Provinces" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-blue-200/40 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
