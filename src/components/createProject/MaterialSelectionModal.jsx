import { useState, useEffect } from 'react'
import { collection, getDocs } from "firebase/firestore"
import { db } from '../../firebase/firebaseConfig'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination.tsx"

export default function MaterialSelectionModal({ isOpen, onClose, onSelectMaterial }) {
  const [materials, setMaterials] = useState([])
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  useEffect(() => {
    async function fetchMaterials() {
      const snapshot = await getDocs(collection(db, "products"))
      const list = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => item.description === "Flooring")
      setMaterials(list)
    }
    if (isOpen) {
      fetchMaterials()
    }
  }, [isOpen])

  const handleSelectMaterial = (material) => {
    setSelectedMaterial(material)
  }

  const handleAddToProject = () => {
    if (selectedMaterial) {
      onSelectMaterial(selectedMaterial)
      onClose()
      setSelectedMaterial(null)
    }
  }

  const handleClose = () => {
    setSelectedMaterial(null)
    setCurrentPage(1)
    onClose()
  }

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = materials.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(materials.length / productsPerPage)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] sm:h-[85vh] flex flex-col">
        <div className="p-3 sm:p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Select Flooring Material</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl p-1"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 flex-1 overflow-y-auto">
            {currentProducts.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectMaterial(item)}
                className={`border rounded-lg p-3 sm:p-4 text-left transition-all duration-200 ${
                  selectedMaterial?.id === item.id 
                    ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50" 
                    : "border-transparent hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-24 sm:h-32 object-cover rounded mb-2 sm:mb-3"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-800 mb-1">{item.title}</p>
                <p className="text-xs text-gray-500 mb-1 sm:mb-2 line-clamp-2">{item.description}</p>
                <p className="text-xs sm:text-sm font-semibold text-green-600">
                  {typeof item.price === "number" ? `$${item.price}/sqft` : item.price}
                </p>
              </button>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mb-3 sm:mb-6">
              <Pagination>
                <PaginationContent className="flex-wrap gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    />
                  </PaginationItem>

                  {/* Mobile: Show only current, prev, next */}
                  <div className="flex sm:hidden">
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="text-xs px-2"
                        >
                          {currentPage - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        isActive={true}
                        className="text-xs px-2"
                      >
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(currentPage + 1)}
                          className="text-xs px-2"
                        >
                          {currentPage + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </div>

                  {/* Desktop: Show all pages if <= 7, otherwise show truncated */}
                  <div className="hidden sm:flex">
                    {totalPages <= 7 ? (
                      Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className="text-sm"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                    ) : (
                      <>
                        {/* First page */}
                        <PaginationItem>
                          <PaginationLink
                            isActive={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            className="text-sm"
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        
                        {/* Ellipsis if needed */}
                        {currentPage > 3 && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center text-sm">...</span>
                          </PaginationItem>
                        )}
                        
                        {/* Current page and neighbors */}
                        {[currentPage - 1, currentPage, currentPage + 1]
                          .filter(page => page > 1 && page < totalPages)
                          .map(page => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => setCurrentPage(page)}
                                className="text-sm"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        
                        {/* Ellipsis if needed */}
                        {currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <span className="flex h-9 w-9 items-center justify-center text-sm">...</span>
                          </PaginationItem>
                        )}
                        
                        {/* Last page */}
                        <PaginationItem>
                          <PaginationLink
                            isActive={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="text-sm"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                  </div>

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
            <button
              onClick={handleClose}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToProject}
              disabled={!selectedMaterial}
              className={`px-4 sm:px-6 py-2 text-sm sm:text-base rounded-md font-medium order-1 sm:order-2 ${
                selectedMaterial
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