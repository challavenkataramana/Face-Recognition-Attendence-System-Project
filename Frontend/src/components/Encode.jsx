import React, { useState } from "react";
import axios from "axios";

const Encode = () => {
  const [output, setOutput] = useState("");

  const handleEncode = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/encode");
      setOutput(res.data.output || "Encoding done!");
    } catch (err) {
      setOutput("Error during encoding.");
    }
  };

  return (
    <div className="border p-4 rounded shadow-xl">
      <h2 className="text-xl font-semibold mb-2">Encode Faces</h2>
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={handleEncode}
      >
        Encode
      </button>
      {output && <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{output}</pre>}
    </div>
  );
};

export default Encode;
