import {
  ArrowBigDownDash,
  Download,
  Eye,
  Trash,
  Activity,
  Mic,
  MessageSquare,
} from "lucide-react";
import { useEffect, useState } from "react";
import MarkdownMessage from "../components/ui/markdown-message";
import { api } from "../lib/api";

export default function History() {
  const [history, setHistory] = useState({
    stats: { totalActivities: 0, identifications: 0, voiceQueries: 0, chatMessages: 0 },
    activities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getHistory()
      .then(setHistory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { title: "Total Activities", value: loading ? "..." : history.stats.totalActivities, subtitle: "All time" },
    { title: "Breed Identifications", value: loading ? "..." : history.stats.identifications, subtitle: "Successful scans" },
    { title: "Voice Queries", value: loading ? "..." : history.stats.voiceQueries, subtitle: "Voice interactions" },
    { title: "Chat Messages", value: loading ? "..." : history.stats.chatMessages, subtitle: "Text conversations" },
  ];

  const logs = history.activities.map((activity) => {
    const isChat = activity.type === "chat";
    const isLogin = activity.type === "login";
    const Icon = isChat ? MessageSquare : isLogin ? Mic : Activity;
    const iconBg = isChat
      ? "bg-purple-100 text-purple-600"
      : isLogin
        ? "bg-blue-100 text-blue-600"
        : "bg-green-100 text-green-600";

    const tags = [
      { label: activity.type, color: "bg-gray-200 text-gray-800" },
    ];

    if (activity.metadata?.prediction) {
      tags.push({ label: activity.metadata.prediction, color: "bg-green-200 text-green-700" });
    }

    if (activity.metadata?.confidence !== undefined) {
      tags.push({
        label: `${activity.metadata.confidence}% confidence`,
        color: "bg-green-600 text-white",
      });
    }

    return {
      icon: Icon,
      iconBg,
      title: activity.title,
      desc: activity.description,
      tags,
      time: new Date(activity.createdAt).toLocaleString(),
      result: activity.result,
    };
  });

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

        <a
          href={api.exportHistoryUrl()}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 transition"
        >
          <Download size={16} />
          Export
        </a>
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
        {logs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4 text-sm text-gray-500">
            No history yet. Your uploads, confirmations, and AI chats will appear here.
          </div>
        )}

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

                    {log.result?.message && (
                      <div className="mt-3 rounded-lg border border-gray-200 bg-[#fbf8f3] p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          AI Result
                        </div>
                        <div className="mb-2 rounded-md bg-white px-3 py-2 text-sm text-gray-700">
                          {log.result.message.question}
                        </div>
                        <MarkdownMessage content={log.result.message.answer} />
                      </div>
                    )}

                    {log.result?.scan && (
                      <div className="mt-3 flex flex-col gap-3 rounded-lg border border-gray-200 bg-[#fbf8f3] p-3 sm:flex-row">
                        <img
                          src={log.result.scan.imageUrl}
                          alt={log.result.scan.prediction}
                          className="h-20 w-20 rounded-lg border object-cover"
                        />
                        <div className="text-sm text-gray-700">
                          <div className="font-semibold text-gray-900">
                            {log.result.scan.prediction}
                          </div>
                          <div>{log.result.scan.confidence}% confidence</div>
                          {log.result.scan.explanation && (
                            <div className="mt-1 text-xs text-gray-500">
                              {log.result.scan.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
