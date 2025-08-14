import { useState } from 'react'
import PaintSelectionModal from './PaintSelectionModal'

export default function PaintPicker({ onSelect }) {
    const [selectedPaint, setSelectedPaint] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleSelectPaint = (paint) => {
        setSelectedPaint(paint)
        onSelect(paint)
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Paint Color</h3>
            
            {selectedPaint ? (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-4">
                        <img
                            src={selectedPaint.image}
                            alt={selectedPaint.name}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{selectedPaint.name}</p>
                            {selectedPaint.description && (
                                <p className="text-sm text-gray-600">{selectedPaint.description}</p>
                            )}
                            {selectedPaint.price && (
                                <p className="text-sm font-semibold text-green-600">
                                    ${selectedPaint.price} per gallon
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                        >
                            Change
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                    <div className="text-gray-600">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
                        </svg>
                        <p className="text-lg font-medium">Select Paint Color</p>
                        <p className="text-sm text-gray-500">Choose from our available paint colors</p>
                    </div>
                </button>
            )}

            <PaintSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectPaint={handleSelectPaint}
            />
        </div>
    )
}