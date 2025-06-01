import { useState } from "react";

export default function ProjectTypeSelector({ value, onChange }) {
  const options = [
    { label: "Flooring", value: "flooring" },
    { label: "Painting", value: "painting" },
    { label: "Both", value: "both" },
  ];

  return (
    <div className="space-y-2 w-full">
      <h2 className="text-lg font-medium text-gray-800">What type of renovation do you need?</h2>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition w-full sm:w-auto text-center ${
              value === option.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}