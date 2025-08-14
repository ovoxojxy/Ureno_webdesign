import { useState } from 'react'

export default function SurfaceAreaForm({ onChange }) {
    const [length, setLength] = useState('')
    const [width, setWidth] = useState('')

    const handleUpdate = (l,w) => {
        const sqft = l * w
        onChange({ 
            squareFeet: sqft,
            dimensions: { 
                length: Number(l) || 0, 
                width: Number(w) || 0 
            }
        })
    }

    return (
      <div className="mt-6">
      <h3 className="text-md font-medium text-gray-800 mb-2">Enter Room Dimensions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Length (ft)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md p-2"
            value={length}
            onChange={(e) => {
              const l = e.target.value;
              setLength(l);
              handleUpdate(Number(l) || 0, Number(width) || 0);
            }}
            placeholder="e.g., 12"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Width (ft)</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md p-2"
            value={width}
            onChange={(e) => {
              const w = e.target.value;
              setWidth(w);
              handleUpdate(Number(length) || 0, Number(w) || 0);
            }}
            placeholder="e.g., 10"
          />
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600">Total: {(Number(length) || 0) * (Number(width) || 0)} sqft</p>
    </div>
    )
}