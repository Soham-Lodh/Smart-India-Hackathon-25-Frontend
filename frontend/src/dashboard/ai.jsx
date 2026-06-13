import {
  Bot,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Leaf,
  Send,
  LoaderCircle,
  Sparkles,
  User2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MarkdownMessage from "../components/ui/markdown-message";
import { useToast } from "../components/ui/toast";
import { api } from "../lib/api";
import {
  addPendingAiMessage,
  completePendingAiMessage,
  getAiState,
  removePendingAiMessage,
  subscribeAiState,
} from "../lib/tool-state";

export default function AiChatAssistant() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const suggestions = [
    "Cattle vaccination schedule",
    "Best feed for milk cows",
    "Disease symptoms",
    "Signs of heat stress",
  ];

  useEffect(() => {
    const syncPending = () => {
      const state = getAiState();
      setLoading(state.pendingMessages.length > 0);
      setMessages((current) => {
        const completed = mergeMessages(
          current.filter((message) => !message.pending),
          state.completedMessages
        );
        return [...completed, ...state.pendingMessages];
      });
    };

    const unsubscribe = subscribeAiState(syncPending);
    syncPending();

    api
      .getAiMessages()
      .then(({ messages }) => {
        const state = getAiState();
        setMessages([
          ...mergeMessages(messages, state.completedMessages),
          ...state.pendingMessages,
        ]);
        setLoading(state.pendingMessages.length > 0);
      })
      .catch(() => {});

    return unsubscribe;
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
    const toastId = showToast({
      type: "loading",
      title: "AI is preparing an answer",
      description: "Your question is being processed. You can continue using the site.",
      duration: 0,
    });

    const pendingMessage = {
      _id: `pending-${Date.now()}`,
      question: trimmed,
      answer: "",
      pending: true,
    };

    addPendingAiMessage(pendingMessage);
    setMessages((current) => [...current, pendingMessage]);

    try {
      const { message } = await api.askAi(trimmed);
      setMessages((current) =>
        current.map((item) => (item._id === pendingMessage._id ? message : item))
      );
      completePendingAiMessage(pendingMessage._id, message);
      showToast({
        id: toastId,
        type: "success",
        title: "AI answer ready",
        description: "Your assistant response has been added to the chat.",
      });
    } catch (err) {
      removePendingAiMessage(pendingMessage._id);
      setError(err.message);
      setMessages((current) =>
        current.filter((item) => item._id !== pendingMessage._id)
      );
      setQuestion(trimmed);
      showToast({
        id: toastId,
        type: "error",
        title: "AI request failed",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-4 md:px-8 py-6">

      <div className="mb-6 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <h1 className="!text-xl md:!text-3xl font-bold mb-3">
            AI Chat Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Ask questions about cattle care, breeding, health, and market insights.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-green-700 shadow-sm">
            <Sparkles size={16} />
            OpenRouter AI
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm">
            <Leaf size={16} className="text-green-700" />
            Farm focused
          </div>
        </div>
      </div>

      <div className="max-w-6xl grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

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

        <div className="bg-[#fbf8f3] px-4 md:px-6 py-5">
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

          <div className="space-y-5 h-[48vh] min-h-80 max-h-[540px] overflow-y-auto pr-1">
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
                    <div className="bg-white rounded-xl rounded-tl-sm border border-gray-200 px-4 py-3 max-w-[85%] text-sm text-gray-800 shadow-sm">
                      <MarkdownMessage content={message.answer} />
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

        <div className="border-t bg-white px-6 py-5">
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
              placeholder="Ask about feeding, disease symptoms, breed care..."
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
      <aside className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-fit">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
            <Bot size={17} />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Ask Better</div>
            <div className="text-xs text-gray-500">Useful cattle prompts</div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            "Mention age, breed, symptoms, and feeding routine.",
            "For health concerns, include temperature and behavior changes.",
            "For economics, include location, herd size, and production goal.",
          ].map((tip) => (
            <div
              key={tip}
              className="rounded-lg border border-gray-200 bg-[#fbf8f3] px-3 py-3 text-sm text-gray-700"
            >
              {tip}
            </div>
          ))}
        </div>
      </aside>
      </div>
    </div>
  );
}

function mergeMessages(...groups) {
  const byId = new Map();
  groups.flat().forEach((message) => {
    byId.set(message._id, message);
  });
  return [...byId.values()].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
}
