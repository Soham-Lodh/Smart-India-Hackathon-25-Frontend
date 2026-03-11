import { Mic } from "lucide-react";

export default function VoiceAssistant() {
  const quickCommands = [
    "What is Gir cow milk yield?",
    "Current cattle market prices",
    "Show me Holstein care tips",
    "Vaccination schedule for calves",
  ];

  return (
    <div className="bg-[#fcf8ee] min-h-screen px-8 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="!text-xl md:!text-3xl font-bold mb-4">
          Voice Assistant
        </h1>
        <p className="text-gray-600">
          Get instant answers to your cattle farming questions using voice
          commands or text chat.
        </p>
      </div>

      {/* Voice Assistant Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-7 mb-4 max-w-lg">
        
        {/* Card Title */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600">
            <Mic size={16} />
          </div>
          <span className="text-lg font-semibold text-gray-900">
            Voice Assistant
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Speak naturally in your preferred language to get instant answers
        </p>

        {/* Controls */}
        <div className="flex items-center mb-4">
          <button className="w-12 h-12 rounded-full bg-green-600 flex justify-center items-center text-white hover:scale-105 transition">
            <Mic size={20} />
          </button>

          <button className="ml-3 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition">
            Audio On
          </button>
        </div>

        {/* Quick Commands */}
        <div>
          <span className="font-semibold mb-1 block text-gray-700">
            Quick Commands:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {quickCommands.map((cmd, i) => (
              <button
                key={i}
                className="bg-gray-100 px-3 py-2 rounded-md border border-gray-200 text-sm font-medium w-full text-left text-gray-800 hover:bg-gray-200 transition"
              >
                {cmd}
              </button>
            ))}
          </div>

          <div className="text-xs mt-3 text-gray-400">
            Voice recognition available in: English, हिंदी, पंजाबी, तेलुगु, बांग्ला,
            मराठी
          </div>
        </div>
      </div>
    </div>
  );
}