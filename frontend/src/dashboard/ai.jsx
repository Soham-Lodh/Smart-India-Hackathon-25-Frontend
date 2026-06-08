import {
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Send,
  LoaderCircle,
  Sparkles,
  User2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

export default function AiChatAssistant() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestions = [
    "Cattle vaccination schedule",
    "Best feed for milk cows",
    "Disease symptoms",
    "Market prices today",
  ];

  useEffect(() => {
    api
      .getAiMessages()
      .then(({ messages }) => setMessages(messages))
      .catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendQuestion = async (text = question) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    setLoading(true);
    setQuestion("");

    const pendingMessage = {
      _id: `pending-${Date.now()}`,
      question: trimmed,
      answer: "",
      pending: true,
    };

    setMessages((current) => [...current, pendingMessage]);

    try {
      const { message } = await api.askAi(trimmed);
      setMessages((current) =>
        current.map((item) => (item._id === pendingMessage._id ? message : item))
      );
    } catch (err) {
      setError(err.message);
      setMessages((current) =>
        current.filter((item) => item._id !== pendingMessage._id)
      );
      setQuestion(trimmed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-8 py-6">

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="!text-xl md:!text-3xl font-bold mb-4">
            AI Chat Assistant
          </h1>
          <p className="text-gray-600">
            Ask questions about cattle care, breeding, health, and market insights.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 rounded-full bg-white border border-gray-200 px-4 py-2 text-sm text-green-700 shadow-sm">
          <Sparkles size={16} />
          OpenRouter AI
        </div>
      </div>

      {/* Chat Card */}
      <div className="max-w-4xl bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <div className="font-semibold text-gray-900">AgriScan Assistant</div>
              <div className="text-xs text-gray-500">Cattle care, breed, health and farming support</div>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
            Online
          </span>
        </div>

        <div className="bg-[#fbf8f3] px-6 py-5">
          {/* Assistant Intro Message */}
          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <Bot size={17} />
            </div>

            <div className="bg-white rounded-xl rounded-tl-sm border border-gray-200 px-4 py-3 max-w-[85%] shadow-sm">
              <p className="text-sm text-gray-800">
                Hello! I'm your AI assistant for cattle farming. Ask me about
                care, feeding, health symptoms, breed selection, or market questions.
              </p>

              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                <span>Ready now</span>

                <div className="flex gap-3">
                  <button className="hover:text-green-600 transition">
                    <ThumbsUp size={14} />
                  </button>
                  <button className="hover:text-red-600 transition">
                    <ThumbsDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        "Hello! I'm your AI assistant for cattle farming."
                      )
                    }
                    className="hover:text-gray-600 transition"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5 max-h-[460px] overflow-y-auto pr-1">
            {messages.map((message) => (
              <div key={message._id} className="space-y-3">
                <div className="flex justify-end gap-3">
                  <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-green-700 px-4 py-3 text-sm text-white shadow-sm">
                    {message.question}
                  </div>
                  <div className="w-9 h-9 shrink-0 rounded-full bg-[#f3f1ea] text-gray-700 flex items-center justify-center">
                    <User2 size={16} />
                  </div>
                </div>

                {message.pending ? (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                      <Bot size={17} />
                    </div>
                    <div className="bg-white rounded-xl rounded-tl-sm border border-gray-200 px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LoaderCircle size={16} className="animate-spin text-green-700" />
                        Thinking through your question...
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                      <Bot size={17} />
                    </div>
                    <div className="bg-white rounded-xl rounded-tl-sm border border-gray-200 px-4 py-3 max-w-[85%] text-sm text-gray-800 whitespace-pre-wrap shadow-sm">
                      {message.answer}
                      <div className="flex justify-end gap-3 mt-3 text-xs text-gray-400">
                        <button className="hover:text-green-600 transition">
                          <ThumbsUp size={14} />
                        </button>
                        <button className="hover:text-red-600 transition">
                          <ThumbsDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard?.writeText(message.answer)}
                          className="hover:text-gray-600 transition"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && !loading && (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-white px-5 py-6 text-center text-sm text-gray-500">
              Start with a question or choose a suggestion below.
            </div>
          )}
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Input Section */}
        <div className="border-t bg-white px-6 py-5">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => sendQuestion(s)}
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={question}
              disabled={loading}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendQuestion();
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-50"
              placeholder="Ask about cattle care, breeding, health..."
            />

            <button
              type="button"
              disabled={loading || !question.trim()}
              onClick={() => sendQuestion()}
              className="bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>

          {loading && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <LoaderCircle size={14} className="animate-spin text-green-700" />
              Waiting for AI reply
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
