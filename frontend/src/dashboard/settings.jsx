import { useState } from "react";
import { useEffect } from "react";
import { Camera, Calendar, User2 } from "lucide-react";
import { api } from "../lib/api";

export default function Settings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    country: "",
    avatarUrl: "",
  });

  useEffect(() => {
    api.getMe().then(({ user }) => {
      setForm({
        name: user.profile?.fullName || user.username || "",
        email: user.email || "",
        phone: user.profile?.phone || "",
        dob: user.profile?.dob || "",
        country: user.profile?.country || "",
        avatarUrl: user.profile?.avatarUrl || "",
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-[#f8f9fb] min-h-screen px-8 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">Personal Info</h2>
            <p className="text-sm text-gray-500">
              Update your personal details
            </p>
          </div>

          <div className="flex gap-3">
            <button disabled className="px-4 py-2 text-sm rounded-lg border border-gray-300 opacity-70">
              Cancel
            </button>
            <button disabled className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white opacity-70">
              Save
            </button>
          </div>
        </div>

        <div className="space-y-6">

          {/* Profile Photo */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#f3f1ea] flex items-center justify-center overflow-hidden">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User2 size={28} className="text-gray-500" />
              )}
            </div>

            <div>
              <button disabled className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg opacity-70">
                <Camera size={16} />
                Upload Image
              </button>
              <p className="text-xs text-gray-400 mt-1">
                JPG or PNG. 1MB max.
              </p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full name
            </label>
            <input
              type="text"
              value={form.name}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone number
            </label>
            <div className="flex gap-2">
              <select disabled className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none">
                <option>+1</option>
                <option>+91</option>
                <option>+44</option>
              </select>

              <input
                type="text"
                value={form.phone}
                readOnly
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.dob}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <Calendar
                size={16}
                className="absolute right-3 top-3 text-gray-400"
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Country
            </label>
            <select
              value={form.country}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">{form.country || "Empty"}</option>
              <option>United States</option>
              <option>India</option>
              <option>United Kingdom</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}
