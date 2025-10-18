// StudentSignUp.jsx
import React, { useState } from "react";
import {
  Code,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  User,
  Phone,
  GraduationCap,
  Key,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { studentSignup, saveUserProfile } from "../Service/FirebaseConfig";

const StudentSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    teamId: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.studentId ||
      !formData.teamId ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    // Password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    // Terms agreement validation
    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setIsLoading(false);
      return;
    }
    try {
      // Use Firebase signup - teamId is the adminId
      const user = await studentSignup(
        formData.email,
        formData.password,
        formData.teamId
      );
      // Save additional profile data
      await saveUserProfile(user.uid, {
        name: formData.fullName,
        phone: formData.phone,
        studentId: formData.studentId,
        email: formData.email,
        joinedAt: new Date(),
      });
      console.log("Student signed up successfully");
      setSuccess("Account created successfully! Redirecting...");
      // Delay to allow Firestore writes to propagate and auth state to update
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">{success}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center">
              <Code className="w-10 h-10 text-gray-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-4xl">
                GradeA<span className="text-yellow-500">+</span>
              </h1>
              <p className="text-gray-400 text-sm">Student Management System</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Join Our Community
              </h3>
              <p className="text-gray-400">
                Become part of a thriving learning community and track your
                progress toward excellence.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Access Resources
              </h3>
              <p className="text-gray-400">
                Get instant access to class materials, assignments, and
                collaborative tools.
              </p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="w-12 h-12 bg-yellow-500 bg-opacity-20 rounded-xl flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">
                Build Your Future
              </h3>
              <p className="text-gray-400">
                Start your journey to becoming a skilled developer with our
                comprehensive program.
              </p>
            </div>
          </div>
        </div>
        {/* Right Side - Sign Up Form */}
        <div className="w-full">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Code className="w-7 h-7 text-gray-900" />
              </div>
              <h1 className="text-white font-bold text-2xl">
                GradeA<span className="text-yellow-500">+</span>
              </h1>
            </div>
            <div className="mb-8">
              <h2 className="text-white text-3xl font-bold mb-2">
                Create Student Account
              </h2>
              <p className="text-gray-400">
                Sign up to start your learning journey
              </p>
            </div>
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4 mb-6 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-white text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              {/* Email Field */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                    placeholder="student@example.com"
                  />
                </div>
              </div>
              {/* Phone, Student ID, and Team ID Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                      placeholder="+233 XXX XXX XXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                      placeholder="STD2024XXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Team ID *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="teamId"
                      value={formData.teamId}
                      onChange={handleChange}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Enter your admin's team ID (e.g., TEAM001)"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Ask your admin for the team ID
                  </p>
                </div>
              </div>
              {/* Password Field */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-12 pr-12 py-3 outline-none focus:border-yellow-500 transition-colors"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Confirm Password Field */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg pl-12 pr-12 py-3 outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 bg-gray-900 border-gray-700 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <label className="text-gray-400 text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-yellow-500 hover:text-yellow-400"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>
            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              © 2025 GradeA+. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp;
