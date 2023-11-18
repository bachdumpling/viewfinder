import React from "react";

function OutputCard({ outputValue }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl text-black font-bold mb-2">Output:</h2>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <pre className="text-gray-800">
          {JSON.stringify(outputValue, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default OutputCard;
