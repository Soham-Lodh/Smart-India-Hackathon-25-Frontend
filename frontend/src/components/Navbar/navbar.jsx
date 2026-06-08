import { MessageCircle, Bell, SunMedium, Globe, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../../lib/api";

const MemberTopNavbar = () => {
  const [user, setUser] = useState(getStoredUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdate = () => setUser(getStoredUser());
    window.addEventListener("agriscan-user-updated", handleUpdate);
    return () => window.removeEventListener("agriscan-user-updated", handleUpdate);
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Top green news bar */}
      <div className="flex h-13 items-center justify-center bg-[#0b6b12] text-white text-[18px] font-medium">
        <span className="mr-3 rounded-full bg-[#f3f0d8] px-3 py-1 text-[13px] text-[#3D3436]">
          Latest News
        </span>
        <span>New Rule Book Released - Government Cattle Breeding Guidelines 2025</span>
      </div>

      {/* Main Navbar */}
      <div className="flex h-16 w-full items-center justify-between bg-[#fbf9f1] border-b border-gray-300 px-6 shadow-sm">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5dcc4]">
            {/* Logo here */}
          </div>
          <h1 className="!text-[25px] font-medium text-[#3D3436] whitespace-nowrap">
            Welcome to Cattle Breed Recognition
          </h1>
        </div>

        {/* Center Greeting */}
        <div className="text-[20px] text-[#8b7f81]">
          Hello, {user?.username || "User"}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Chat */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1ea]">
            <MessageCircle className="h-5 w-5 text-[#3D3436]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-semibold text-white">
              3
            </span>
          </div>

          {/* Notifications */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1ea]">
            <Bell className="h-5 w-5 text-[#3D3436]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-semibold text-white">
              2
            </span>
          </div>

          {/* Theme Toggle */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1ea]">
            <SunMedium className="h-5 w-5 text-[#3D3436]" />
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 rounded-full bg-[#f3f1ea] px-3 py-1 text-sm text-[#3D3436]">
            <Globe className="h-5 w-5" />
            <span>English</span>
          </div>

          {/* Profile */}
          <button
            type="button"
            onClick={() => navigate("/admin/requests")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f1ea]"
          >
            <User2 className="h-5 w-5 text-[#3D3436]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberTopNavbar;
