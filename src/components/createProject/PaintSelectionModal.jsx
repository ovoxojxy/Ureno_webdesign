import { useState, useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore"
import { db } from '@/firebase/firebaseConfig'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination.tsx"

export default function PaintSelectionModal({ isOpen, onClose, onSelectPaint }) {
  const [paintColors, setPaintColors] = useState([])
  const [selectedPaint, setSelectedPaint] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const colorsPerPage = 12

  useEffect(() => {
    async function fetchPaintColors() {
      const snapshot = await getDocs(collection(db, "colors"))
      const colorList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPaintColors(colorList)
    }
    if (isOpen) {
      fetchPaintColors()
    }
  }, [isOpen])

  const handleSelectPaint = (paint) => {
    setSelectedPaint(paint)
  }

  const handleAddToProject = () => {
    if (selectedPaint) {
      onSelectPaint(selectedPaint)
      onClose()
      setSelectedPaint(null)
    }
  }

  const handleClose = () => {
    setSelectedPaint(null)
    setCurrentPage(1)
    onClose()
  }

  // Pagination calculations
  const indexOfLastColor = currentPage * colorsPerPage
  const indexOfFirstColor = indexOfLastColor - colorsPerPage
  const currentColors = paintColors.slice(indexOfFirstColor, indexOfLastColor)
  const totalPages = Math.ceil(paintColors.length / colorsPerPage)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[85vh] flex flex-col">
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Select Paint Color</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {currentColors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleSelectPaint(color)}
                className={`border rounded-lg p-3 text-center transition-all duration-200 ${
                  selectedPaint?.id === color.id 
                    ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50" 
                    : "border-transparent hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <img
                  src={color.image}
                  alt={color.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <p className="text-xs font-medium text-gray-800 mb-1">{color.name}</p>
                {color.price && (
                  <p className="text-xs text-green-600 font-semibold">
                    ${color.price}/gallon
                  </p>
                )}
              </button>
            ))}
            </div>

          {selectedPaint && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Selected Color Preview</h3>
              <div className="flex items-center gap-4">
                <img
                  src={selectedPaint.image}
                  alt={selectedPaint.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">{selectedPaint.name}</p>
                  {selectedPaint.price && (
                    <p className="text-green-600 font-medium">${selectedPaint.price} per gallon</p>
                  )}
                  {selectedPaint.description && (
                    <p className="text-sm text-gray-600 mt-1">{selectedPaint.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mb-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToProject}
              disabled={!selectedPaint}
              className={`px-6 py-2 rounded-md font-medium ${
                selectedPaint
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Add to Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}