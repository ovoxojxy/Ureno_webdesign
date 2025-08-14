import { useState } from 'react'
import MaterialSelectionModal from './MaterialSelectionModal'

export default function MaterialPicker({ onSelect }) {
    const [selectedMaterial, setSelectedMaterial] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleSelectMaterial = (material) => {
        setSelectedMaterial(material)
        onSelect(material)
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Flooring Material</h3>
            
            {selectedMaterial ? (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-4">
                        <img
                            src={selectedMaterial.image}
                            alt={selectedMaterial.title}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{selectedMaterial.title}</p>
                            <p className="text-sm text-gray-600">{selectedMaterial.description}</p>
                            <p className="text-sm font-semibold text-green-600">
                                {typeof selectedMaterial.price === "number" ? `$${selectedMaterial.price}/sqft` : selectedMaterial.price}
                            </p>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-lg font-medium">Select Flooring Material</p>
                        <p className="text-sm text-gray-500">Choose from our available flooring options</p>
                    </div>
                </button>
            )}

            <MaterialSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectMaterial={handleSelectMaterial}
            />
        </div>
    )
}