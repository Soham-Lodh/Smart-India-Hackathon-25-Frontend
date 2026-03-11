import { useState } from "react";
import { Camera, Calendar } from "lucide-react";

export default function Settings() {
  const [form, setForm] = useState({
    name: "John Marpung",
    email: "john@gmail.com",
    phone: "(684) 555-0102",
    dob: "1999/04/12",
    country: "United States",
  });

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
            <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition">
              Save
            </button>
          </div>
        </div>

        <div className="space-y-6">

          {/* Profile Photo */}
          <div className="flex items-center gap-6">
            <img
              src="https://i.pravatar.cc/100"
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />

            <div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">
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
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone number
            </label>
            <div className="flex gap-2">
              <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none">
                <option>+1</option>
                <option>+91</option>
                <option>+44</option>
              </select>

              <input
                type="text"
                value={form.phone}
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
                type="text"
                value={form.dob}
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
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-600">
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
