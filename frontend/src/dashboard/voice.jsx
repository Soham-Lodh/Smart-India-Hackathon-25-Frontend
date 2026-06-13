import {
  AlertCircle,
  Bot,
  CircleDot,
  LoaderCircle,
  Mic,
  MicOff,
  Send,
  Square,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import MarkdownMessage from "../components/ui/markdown-message";
import { useToast } from "../components/ui/toast";
import { api } from "../lib/api";

export default function VoiceAssistant() {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [permission, setPermission] = useState("unknown");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const quickCommands = [
    "What is Gir cow milk yield?",
    "Current cattle market prices",
    "Show me Holstein care tips",
    "Vaccination schedule for calves",
  ];

  const SpeechRecognition = useMemo(
    () => window.SpeechRecognition || window.webkitSpeechRecognition,
    []
  );
  const isSpeechSupported = Boolean(SpeechRecognition);

  useEffect(() => {
    if (!navigator.permissions?.query) return;

    navigator.permissions
      .query({ name: "microphone" })
      .then((status) => {
        setPermission(status.state);
        status.onchange = () => setPermission(status.state);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const askForMic = async () => {
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermission("granted");
      return true;
    } catch {
      setPermission("denied");
      setError("Microphone permission was denied. You can still type your question below.");
      return false;
    }
  };

  const startListening = async () => {
    if (!isSpeechSupported) {
      setError("Speech recognition is not supported in this browser. Please type your question.");
      return;
    }

    const hasPermission = permission === "granted" || (await askForMic());
    if (!hasPermission) return;

    setError("");
    setReply("");
    setTranscript("");
    setInterimTranscript("");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((current) => `${current} ${finalText}`.trim());
      }
      setInterimTranscript(interimText.trim());
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setError(
        event.error === "not-allowed"
          ? "Microphone permission was denied. Please allow mic access or type your question."
          : "Voice recognition stopped unexpectedly. Please try again."
      );
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendQuestion = async (text = transcript) => {
    const question = text.trim();
    if (!question || loading) return;

    setError("");
    setLoading(true);
    setReply("");
    const toastId = showToast({
      type: "loading",
      title: "Voice question sent",
      description: "The AI is preparing a text reply. You can keep using the dashboard.",
      duration: 0,
    });

    try {
      const { message } = await api.askVoice(question);
      setReply(message.answer);
      setTranscript(message.question);
      showToast({
        id: toastId,
        type: "success",
        title: "Voice answer ready",
        description: "The AI reply is available in the voice assistant panel.",
      });
    } catch (err) {
      setError(err.message);
      showToast({
        id: toastId,
        type: "error",
        title: "Voice request failed",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const visibleTranscript = [transcript, interimTranscript].filter(Boolean).join(" ");

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-4 md:px-8 py-6">
      <div className="mb-6 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <h1 className="!text-xl md:!text-3xl font-bold mb-3">
            Voice Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Speak in English, convert your voice to text, and get a text answer from AI.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-green-700 shadow-sm">
            <Volume2 size={16} />
            English voice
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm">
            <CircleDot size={16} className={isListening ? "text-red-600" : "text-gray-400"} />
            {isListening ? "Recording" : "Ready"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700">
                <Mic size={18} />
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  Voice Capture
                </div>
                <div className="text-xs text-gray-500">
                  Browser converts English speech to text before sending it to AI
                </div>
              </div>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full ${
                permission === "granted"
                  ? "bg-green-100 text-green-700"
                  : permission === "denied"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              Mic {permission}
            </span>
          </div>

          <div className="p-6">
            {!isSpeechSupported && (
              <div className="mb-4 flex gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                Speech recognition is unavailable in this browser. Type your question instead.
              </div>
            )}

            {error && (
              <div className="mb-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="rounded-xl border border-gray-200 bg-[#fbf8f3] px-5 py-5 min-h-44 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-800">
                  Recognized text
                </span>
                {isListening && (
                  <span className="flex items-center gap-2 text-xs text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                    Listening
                  </span>
                )}
              </div>

              <textarea
                value={visibleTranscript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  setInterimTranscript("");
                }}
                placeholder="Your English voice transcript will appear here..."
                className="w-full min-h-28 resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {!isListening ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={startListening}
                  className="flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  <Mic size={18} />
                  Start Listening
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopListening}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 transition"
                >
                  <Square size={18} />
                  Stop
                </button>
              )}

              <button
                type="button"
                disabled={loading || !visibleTranscript.trim()}
                onClick={() => sendQuestion(visibleTranscript)}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {loading ? "Asking AI..." : "Send to AI"}
              </button>

              <button
                type="button"
                disabled={loading || (!transcript && !interimTranscript)}
                onClick={() => {
                  setTranscript("");
                  setInterimTranscript("");
                  setReply("");
                  setError("");
                }}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                <MicOff size={18} />
                Clear
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <span className="font-semibold text-gray-900">AI Reply</span>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LoaderCircle size={16} className="animate-spin text-green-700" />
                  Preparing an answer from OpenRouter...
                </div>
              ) : reply ? (
                <MarkdownMessage content={reply} />
              ) : (
                <p className="text-sm text-gray-500">
                  Your answer will appear here after you send the recognized text.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
          <span className="font-semibold mb-1 block text-gray-700">
            Quick Commands
          </span>
          <p className="text-xs text-gray-500 mb-4">
            Click one to send it directly, or speak your own question in English.
          </p>

          <div className="grid grid-cols-1 gap-2">
            {quickCommands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                disabled={loading}
                onClick={() => {
                  setTranscript(cmd);
                  setInterimTranscript("");
                  sendQuestion(cmd);
                }}
                className="bg-gray-100 px-3 py-3 rounded-md border border-gray-200 text-sm font-medium w-full text-left text-gray-800 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {cmd}
              </button>
            ))}
          </div>

          <div className="text-xs mt-4 text-gray-400">
            Voice recognition language is fixed to English (en-US).
          </div>

          <div className="mt-5 rounded-lg border border-gray-200 bg-[#fbf8f3] px-4 py-4 text-sm text-gray-700">
            Speak naturally, review the transcript, then send it. Only the final text goes to the backend.
          </div>
        </div>
      </div>
    </div>
  );
}
