import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;