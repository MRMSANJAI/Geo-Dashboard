import React from 'react';

export default function ESGLeafLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-green-700">
      {/* Leaf Icon Spinner */}
      <div className="animate-spin-slow">
        <svg
          className="w-16 h-16 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 2C8 4 4 8 4 14c0 4 3 6 6 6 5 0 10-5 10-10 0-3-1-6-4-8z"
          />
        </svg>
      </div>

      {/* Text */}
      <p className="mt-4 text-lg font-semibold text-green-800 animate-pulse">
        Sustaining the Future...
      </p>
    </div>
  );
}
