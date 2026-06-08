import { Clock, Upload, Camera, FolderUp, Search } from "lucide-react";
import { useRef, useState } from "react";
import { api } from "../lib/api";

export default function IdentifyBreed() {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState("");
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;

    setError("");
    setScan(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const { scan: createdScan } = await api.uploadScan(file);
      setScan(createdScan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmPrediction = async (isCorrect) => {
    if (!scan) return;
    setConfirming(true);
    setError("");

    try {
      const { scan: updatedScan } = await api.confirmScan(scan._id, isCorrect);
      setScan(updatedScan);
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files?.[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-dashed border-2 border-gray-300 rounded-lg w-44 h-44 flex flex-col items-center justify-center mb-4 hover:bg-gray-50 transition cursor-pointer overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="Selected cattle" className="w-full h-full object-cover" />
            ) : (
              <>
                <Upload size={40} className="mb-2 text-gray-500" />
                <span className="font-semibold text-sm text-gray-800">
                  Upload Cattle Image
                </span>
              </>
            )}
          </div>

          <span className="text-xs text-gray-500 mb-3 text-center">
            Drag and drop your cattle image here, or click to browse
          </span>

          <div className="flex gap-4 mb-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-200 transition"
            >
              <Camera size={16} />
              Take Photo
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md border text-sm font-medium hover:bg-gray-200 transition"
            >
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
          {loading ? (
            <>
              <Search size={40} className="mb-3 text-gray-400 animate-pulse" />
              <span className="font-semibold text-sm mb-2 text-gray-800">
                Identifying Breed...
              </span>
              <span className="text-xs text-gray-500 text-center">
                Uploading image and asking the AI model
              </span>
            </>
          ) : scan ? (
            <div className="w-full text-center">
              <img
                src={scan.imageUrl}
                alt="Uploaded cattle"
                className="mx-auto mb-3 h-20 w-20 rounded-lg object-cover border"
              />
              <div className="font-semibold text-gray-900">{scan.prediction}</div>
              <div className="text-sm text-gray-600 mb-2">
                Confidence: {scan.confidence}%
              </div>
              {scan.explanation && (
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {scan.explanation}
                </p>
              )}

              {scan.userConfirmed ? (
                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Marked {scan.status}
                </span>
              ) : (
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    disabled={confirming}
                    onClick={() => confirmPrediction(true)}
                    className="px-4 py-2 rounded-md bg-green-700 text-white text-sm hover:bg-green-800 transition"
                  >
                    Correct
                  </button>
                  <button
                    type="button"
                    disabled={confirming}
                    onClick={() => confirmPrediction(false)}
                    className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition"
                  >
                    Incorrect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Search size={40} className="mb-3 text-gray-400" />
              <span className="font-semibold text-sm mb-2 text-gray-800">
                No Results Yet
              </span>
              <span className="text-xs text-gray-500 text-center">
                Upload an image to see breed identification results here
              </span>
            </>
          )}
        </div>

      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
