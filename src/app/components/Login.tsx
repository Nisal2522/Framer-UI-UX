import { useNavigate } from "react-router";
import { Sprout, Users, Shield, ArrowLeft } from "lucide-react";
import { useState } from "react";
import backgroundImage from "../../assets/AgreCoopLogin.gif";
import { setPortalUser } from "../auth/portalUser";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"admin" | "cooperative">("cooperative");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const role = userType === "admin" ? "government_admin" : "cooperative";
    setPortalUser({ role, email: email.trim() || (role === "government_admin" ? "admin@maff.gov.kh" : "user@coop.local") });
    if (userType === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Full page background image */}
      <img
        src={backgroundImage}
        alt="Agricultural cooperative background"
        className="fixed inset-0 w-full h-full object-cover"
      />
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-black/40"></div>

      {/* Left side - Image with overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="relative z-10 flex flex-col justify-start pt-8 px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <Sprout className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AgriCoop Portal</h1>
                <p className="text-blue-100 text-sm">Agricultural Farmer Cooperative Management</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-16 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-200 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Connecting Communities</h3>
                  <p className="text-blue-100 text-sm">
                    Bringing Farmers, Cooperatives, and Government together on one unified platform for better collaboration and growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-200 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Streamlined Management</h3>
                  <p className="text-blue-100 text-sm">
                    Manage business plans, monitor assets, track farmer profiles, and access comprehensive analytics all in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-end pr-12 p-4 sm:p-6 md:p-8 relative">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-[#0F2F8F] p-3 rounded-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AgriCoop Portal</h1>
              <p className="text-blue-100 text-sm">Cooperative Management</p>
            </div>
          </div>

          <div className="border border-gray-200 shadow-lg bg-white/95 backdrop-blur-sm rounded-lg">
            <div className="space-y-1 p-6 pb-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1 text-sm text-[#0F2F8F] hover:text-[#0D2A7D] mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="text-sm text-gray-500">
                Sign in to your account to continue
              </p>
            </div>
            <div className="p-6 pt-0">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium leading-none">Login as</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="radio"
                        value="cooperative"
                        id="cooperative"
                        checked={userType === "cooperative"}
                        onChange={(e) => setUserType(e.target.value as "admin" | "cooperative")}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="cooperative"
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-checked:border-[#0F2F8F] peer-checked:bg-blue-50 cursor-pointer transition-all"
                      >
                        <Users className="mb-2 h-6 w-6 text-gray-600" />
                        <span className="text-sm font-medium">Cooperative</span>
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        value="admin"
                        id="admin"
                        checked={userType === "admin"}
                        onChange={(e) => setUserType(e.target.value as "admin" | "cooperative")}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor="admin"
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-checked:border-[#0F2F8F] peer-checked:bg-blue-50 cursor-pointer transition-all"
                      >
                        <Shield className="mb-2 h-6 w-6 text-gray-600" />
                        <span className="text-sm font-medium">Government Admin</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email or Username
                  </label>
                  <input
                    id="email"
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium leading-none">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#0F2F8F] hover:text-[#0D2A7D] hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset functionality will be implemented");
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0F2F8F] focus:ring-[#0F2F8F]"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2F8F] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0F2F8F] text-white hover:bg-[#0D2A7D] h-11"
                >
                  Sign in
                </button>

                {/* Help text */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  {userType === "cooperative" ? (
                    <p>
                      New cooperative?{" "}
                      <a
                        href="#"
                        className="text-[#0F2F8F] hover:text-[#0D2A7D] hover:underline font-medium"
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Contact your government administrator for registration");
                        }}
                      >
                        Contact admin for registration
                      </a>
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      Admin credentials are provided by the system administrator
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-white">
            <p>&copy; 2026 AgriCoop Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
