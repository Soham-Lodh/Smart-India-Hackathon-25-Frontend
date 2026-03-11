import {
  ArrowBigDownDash,
  Download,
  Eye,
  Trash,
  Activity,
  Mic,
  MessageSquare,
} from "lucide-react";

export default function History() {
  const stats = [
    { title: "Total Activities", value: 5, subtitle: "All time" },
    { title: "Breed Identifications", value: 2, subtitle: "Successful scans" },
    { title: "Voice Queries", value: 1, subtitle: "Voice interactions" },
    { title: "Chat Messages", value: 1, subtitle: "Text conversations" },
  ];

  const logs = [
    {
      type: "identification",
      icon: Activity,
      iconBg: "bg-green-100 text-green-600",
      title: "Gir Cow Identified",
      desc: "Breed identification completed with high confidence",
      tags: [
        { label: "Identification", color: "bg-gray-200 text-gray-800" },
        { label: "Gir", color: "bg-green-200 text-green-700" },
        { label: "94% confidence", color: "bg-green-600 text-white" },
      ],
      time: "17/09/2025, 21:32",
    },
    {
      type: "voice",
      icon: Mic,
      iconBg: "bg-blue-100 text-blue-600",
      title: "Voice Query: Holstein Care",
      desc: "Asked about Holstein cattle vaccination schedule",
      tags: [
        { label: "Voice", color: "bg-gray-200 text-gray-800" },
        { label: "Holstein", color: "bg-blue-200 text-blue-700" },
      ],
      time: "17/09/2025, 19:32",
    },
    {
      type: "chat",
      icon: MessageSquare,
      iconBg: "bg-purple-100 text-purple-600",
      title: "Chat: Market Prices",
      desc: "Inquired about current cattle market prices",
      tags: [{ label: "Chat", color: "bg-gray-200 text-gray-800" }],
      time: "17/09/2025, 17:32",
    },
  ];

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-8 py-6">

      {/* Header — Dashboard Standard */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="!text-xl md:!text-3xl font-bold mb-4">
            History
          </h1>
          <p className="text-gray-600">
            View and manage your cattle identification history and AI interactions.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
          >
            <div className="text-sm font-medium text-gray-600">
              {stat.title}
            </div>
            <div className="text-3xl font-bold text-gray-900 my-2">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500">
              {stat.subtitle}
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="space-y-4">
        {logs.map((log, i) => {
          const Icon = log.icon;

          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4"
            >
              <div className="flex items-start justify-between gap-4">

                {/* Left */}
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${log.iconBg}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <div className="font-semibold text-gray-900">
                      {log.title}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      {log.desc}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {log.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          className={`px-2 py-1 rounded text-xs font-medium ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                      {log.time}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition">
                    <ArrowBigDownDash size={16} />
                  </button>
                  <button className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition">
                    <Trash size={16} />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}