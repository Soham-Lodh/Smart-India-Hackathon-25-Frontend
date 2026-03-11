import { Clock, Upload, Camera, FolderUp, Search } from "lucide-react";

export default function IdentifyBreed() {
  return (
    <div className="bg-[#fcf8ee] min-h-screen px-8 py-6">

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="!text-xl md:!text-3xl font-bold mb-4">
            Identify Breed
          </h1>
          <p className="text-gray-600">
            Upload a clear image of your cattle to get instant breed
            identification and care recommendations.
          </p>
        </div>

        <a href="/dashboard/history">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
            <Clock size={16} />
            View History
          </button>
        </a>
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <h2 className="text-lg font-bold mb-1">Tips for Best Results</h2>
        <p className="text-gray-600 mb-4 text-sm">
          Follow these guidelines for accurate breed identification
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[ 
            "Take photos in good lighting conditions",
            "Capture the full body or clear head shot",
            "Ensure the animal is clearly visible"
          ].map((tip, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <span className="text-sm text-gray-700">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload + Result Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Upload Box */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-72 p-6">

          <div className="border-dashed border-2 border-gray-300 rounded-lg w-44 h-44 flex flex-col items-center justify-center mb-4 hover:bg-gray-50 transition cursor-pointer">
            <Upload size={40} className="mb-2 text-gray-500" />
            <span className="font-semibold text-sm text-gray-800">
              Upload Cattle Image
            </span>
          </div>

          <span className="text-xs text-gray-500 mb-3 text-center">
            Drag and drop your cattle image here, or click to browse
          </span>

          <div className="flex gap-4 mb-3">
            <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-200 transition">
              <Camera size={16} />
              Take Photo
            </button>

            <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-200 transition">
              <FolderUp size={16} />
              Browse Files
            </button>
          </div>

          <span className="text-xs text-gray-400">
            Supports: JPG, PNG, WebP (Max 10MB)
          </span>
        </div>

        {/* Result Box */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-72 p-6">
          <Search size={40} className="mb-3 text-gray-400" />
          <span className="font-semibold text-sm mb-2 text-gray-800">
            No Results Yet
          </span>
          <span className="text-xs text-gray-500 text-center">
            Upload an image to see breed identification results here
          </span>
        </div>

      </div>
    </div>
  );
}