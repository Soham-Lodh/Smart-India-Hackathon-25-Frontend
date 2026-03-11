import {
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Send,
} from "lucide-react";

export default function AiChatAssistant() {
  const suggestions = [
    "Cattle vaccination schedule",
    "Best feed for milk cows",
    "Disease symptoms",
    "Market prices today",
  ];

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-8 py-6">

      {/* Header — Matches Dashboard */}
      <div className="mb-6">
        <h1 className="!text-xl md:!text-3xl font-bold mb-4">
          AI Chat Assistant
        </h1>
        <p className="text-gray-600">
          Ask questions about cattle care, breeding, health, and market insights.
        </p>
      </div>

      {/* Chat Card */}
      <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm p-6">

        {/* Assistant Intro Message */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <Bot size={18} />
          </div>

          <div className="bg-gray-100 rounded-lg px-4 py-3 w-full">
            <p className="text-sm text-gray-800">
              Hello! I'm your AI assistant for cattle farming. You can ask me
              questions using voice or text. How can I help you today?
            </p>

            <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
              <span>23:34</span>

              <div className="flex gap-3">
                <button className="hover:text-green-600 transition">
                  <ThumbsUp size={14} />
                </button>
                <button className="hover:text-red-600 transition">
                  <ThumbsDown size={14} />
                </button>
                <button className="hover:text-gray-600 transition">
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="border-t pt-4">

          <div className="flex items-center gap-2 mb-4">
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-600"
              placeholder="Ask about cattle care, breeding, health..."
            />

            <button className="bg-green-700 text-white p-2 rounded-md hover:bg-green-800 transition">
              <Send size={16} />
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-200 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}