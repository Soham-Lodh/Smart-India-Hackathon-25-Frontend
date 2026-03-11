import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT BRAND PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#166700] to-[#0f4d00] text-white flex-col justify-center px-16">
        <h1 className="text-4xl font-bold mb-6">
          AgriScan
        </h1>
        <p className="text-lg leading-relaxed text-green-100">
          Smart cattle identification and agricultural insights
          powered by AI. Track growth, improve profit, and manage
          livestock with confidence.
        </p>

        <div className="mt-10 space-y-3 text-green-200 text-sm">
          <p>✔ AI Breed Identification</p>
          <p>✔ Economic Growth Analytics</p>
          <p>✔ Farmer Profit Tracking</p>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="w-full md:w-1/2 bg-[#fcf8ee] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-200">

          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Login to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166700] focus:border-[#166700] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#166700] focus:border-[#166700] transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#166700] text-white py-3 rounded-xl font-semibold shadow-md transition-all duration-200 hover:bg-[#145c00] hover:shadow-lg hover:scale-[1.02]"
            >
              Get Started
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}