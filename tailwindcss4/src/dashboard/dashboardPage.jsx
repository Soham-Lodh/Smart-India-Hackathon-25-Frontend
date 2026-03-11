import {
  Camera,
  Check,
  Clock,
  DollarSign,
  Mic,
  Settings as SettingsIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Cattle Identified",
      value: "1,247",
      change: "+12% from last month",
      changeColor: "text-green-500",
      icon: <SettingsIcon size={18} />,
    },
    {
      title: "Farmer Profit",
      value: "₹2,45,000",
      change: "+8.2% from last month",
      changeColor: "text-green-500",
      icon: <DollarSign size={18} />,
    },
    {
      title: "Accuracy Rate",
      value: "94.8%",
      change: "+2.1% from last month",
      changeColor: "text-green-500",
      icon: <TrendingUp size={18} />,
    },
    {
      title: "Monthly Scans",
      value: "156",
      change: "-3% from last month",
      changeColor: "text-red-500",
      icon: <TrendingDown size={18} />,
    },
  ];

  const actions = [
    {
      title: "Upload Cattle Image",
      description: "Take or upload a photo to identify cattle breed.",
      bgColor: "bg-green-700",
      icon: <Camera size={18} />,
      id: "upload",
    },
    {
      title: "Voice Assistant",
      description: "Ask questions about cattle care and breeding.",
      bgColor: "bg-yellow-400",
      icon: <Mic size={18} />,
      id: "ai",
    },
    {
      title: "Economic Data",
      description: "View market trends and profit analysis.",
      bgColor: "bg-green-700",
      icon: <TrendingUp size={18} />,
      id: "economic",
    },
    {
      title: "History",
      description: "Review your previous breed identification.",
      bgColor: "bg-yellow-400",
      icon: <Clock size={18} />,
      id: "history",
    },
  ];

  const activities = [
    {
      title: "Female Cow Identified",
      tag: "identification",
      description: "Breed identified with 96% confidence",
      time: "2 hours ago",
    },
    {
      title: "Voice Query Answered",
      tag: "voice",
      description: "Asked about vaccination schedule for Holstein",
      time: "4 hours ago",
    },
  ];

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-8 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="!text-xl md:!text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your cattle management today.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT COLUMN */}
        <div className="md:col-span-2 flex flex-col gap-8">

          {/* Stats */}
          {/* Stats */}
<section>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat) => {
      const isPositive = stat.change.includes("+");

      return (
        <div
          key={stat.title}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
        >
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">
              {stat.title}
            </div>

            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
              {stat.icon}
            </div>
          </div>

          {/* Main Value */}
          <div className="text-3xl font-bold text-gray-900 mb-3">
            {stat.value}
          </div>

          {/* Trend */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                isPositive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {stat.change}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

          {/* Quick Actions */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-1">Quick Actions</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Common tasks to get you started
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {actions.map((action) => (
                <div
                  key={action.title}
                  onClick={() => navigate(`/dashboard/${action.id}`)}
                  className="flex items-center rounded-lg border border-gray-200 p-4 hover:cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className={`${action.bgColor} p-2 rounded-md mr-3 text-white`}>
                    {action.icon}
                  </div>

                  <div>
                    <div className="font-semibold text-sm">
                      {action.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {action.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div>

          <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-1">Recent Activity</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Your latest interactions with the platform
            </p>

            <ul className="space-y-4">
              {activities.map((activity) => (
                <li key={activity.title} className="flex items-start space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center bg-green-200 rounded-full text-green-700">
                    <Check size={14} />
                  </div>

                  <div>
                    <div className="font-semibold text-sm">
                      {activity.title}
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-700 text-white rounded">
                        {activity.tag}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      {activity.description}
                    </div>

                    <div className="text-xs text-gray-400">
                      {activity.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

          </section>

        </div>

      </div>
    </div>
  );
}