import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setMessage({ text: "Initializing camera...", type: "info" });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setMessage({
          text: "Camera ready. Position your face in the frame.",
          type: "info",
        });
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setMessage({
        text: "Camera access denied. Please enable camera permissions.",
        type: "error",
      });
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  const handleCaptureClick = async () => {
    if (!name.trim()) {
      setMessage({
        text: "Please enter your name before capturing.",
        type: "error",
      });
      return;
    }

    setShowCamera(true);
    setMessage({ text: "Preparing camera...", type: "info" });

    try {
      await startCamera();
    } catch (err) {
      setMessage({ text: "Failed to start camera.", type: "error" });
    }
  };

  useEffect(() => {
    if (message.type === "success") {
      console.log("Attempting to call /encode...");
      (async () => {
        try {
          await axios.post("http://127.0.0.1:5000/encode");
          setMessage({ text: "Face encoding completed!", type: "success" });
        } catch (encodeErr) {
          console.error("Encoding error:", encodeErr);
          setMessage({
            text:
              "Registration complete but encoding failed. " +
              (encodeErr.response?.data?.error || "Please try again later."),
            type: "warning",
          });
        }
      })();
    }
  }, [message.type]);

  const handleSave = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;

    setIsLoading(true);
    setMessage({ text: "Processing your image...", type: "info" });

    try {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      const imageBase64 = canvasRef.current.toDataURL("image/jpeg", 0.8);

      const registerRes = await axios.post("http://127.0.0.1:5000/register", {
        name: name.trim(),
        image: imageBase64,
      });

      setMessage({
        text: registerRes.data.message || "Registration successful!",
        type: "success",
      });
    } catch (err) {
      console.error("Registration error:", err);
      setMessage({
        text:
          err.response?.data?.error ||
          "Error during registration. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      stopCamera();
      setShowCamera(false);
    }
  };

  const handleQuit = () => {
    stopCamera();
    setShowCamera(false);
    setMessage({ text: "Camera closed.", type: "info" });
  };

  const getMessageStyle = () => {
    switch (message.type) {
      case "error":
        return "bg-red-100 border-red-400 text-red-700";
      case "success":
        return "bg-green-100 border-green-400 text-green-700";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Face Registration</h2>
          <p className="text-sm text-blue-100 text-center mt-1">
            Register your face for authentication
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleCaptureClick}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
              flex items-center justify-center`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Capture Your Face"
            )}
          </button>

          {showCamera && (
            <div className="mt-6 animate-fadeIn">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto rounded-lg border-2 border-gray-200 bg-gray-800"
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="text-white text-center p-4">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <p>Initializing camera...</p>
                    </div>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleSave}
                  disabled={!cameraActive || isLoading}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition
                    ${
                      !cameraActive || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }
                    flex items-center justify-center`}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleQuit}
                  disabled={isLoading}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition
                    ${
                      isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {message.text && (
            <div className={`mt-4 border-l-4 p-4 rounded ${getMessageStyle()}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {message.type === "error" && (
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {message.type === "success" && (
                    <svg
                      className="h-5 w-5 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {message.type === "warning" && (
                    <svg
                      className="h-5 w-5 text-yellow-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {message.type === "info" && (
                    <svg
                      className="h-5 w-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Make sure your face is well-lit and clearly visible in the frame.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
