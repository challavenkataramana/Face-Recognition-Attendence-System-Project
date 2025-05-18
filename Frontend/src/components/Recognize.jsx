import React, { useState } from "react";
import axios from "axios";

const Recognize = () => {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [lastRecognized, setLastRecognized] = useState(null);

  const handleRecognize = async () => {
    setLoading(true);
    setMessage({ text: "Scanning for faces...", type: "info" });

    try {
      const res = await axios.get("http://127.0.0.1:5000/recognize");
      
      if (res.data.message) {
        setMessage({ 
          text: res.data.message, 
          type: "success" 
        });
        setLastRecognized({
          name: res.data.message.replace("Face recognized: ", ""),
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        setMessage({ 
          text: "No face recognized", 
          type: "warning" 
        });
      }
    } catch (err) {
      console.error("Recognition error:", err);
      setMessage({ 
        text: err.response?.data?.error || "Error during recognition", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const getMessageStyle = () => {
    switch(message.type) {
      case "error": return "bg-red-50 border-l-4 border-red-500 text-red-700";
      case "success": return "bg-green-50 border-l-4 border-green-500 text-green-700";
      case "warning": return "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700";
      case "info": return "bg-blue-50 border-l-4 border-blue-500 text-blue-700";
      default: return "bg-gray-50 border-l-4 border-gray-500 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">Face Recognition</h2>
          <p className="text-sm text-green-100 text-center mt-1">
            Backend scanning system
          </p>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40 rounded-full border-4 border-gray-200 bg-gray-100 overflow-hidden flex items-center justify-center">
              {loading ? (
                <div className="animate-pulse flex space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              ) : (
                <svg 
                  className="w-20 h-20 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              )}
            </div>
          </div>

          <button
            onClick={handleRecognize}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition flex items-center justify-center
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning...
              </>
            ) : (
              'Scan for Faces'
            )}
          </button>

          {message.text && (
            <div className={`mt-4 p-4 rounded ${getMessageStyle()}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {message.type === "error" && (
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.type === "success" && (
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.type === "warning" && (
                    <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {message.type === "info" && (
                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          {lastRecognized && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Recognized</h3>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-800">
                  {lastRecognized.name}
                </p>
                <span className="text-xs text-gray-500">
                  {lastRecognized.timestamp}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Press the button to scan for recognizable faces
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recognize;