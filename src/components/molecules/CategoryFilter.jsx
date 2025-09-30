import { useState } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleCategorySelect = (category) => {
    onCategoryChange(category)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[120px] justify-between"
      >
        <span className="truncate">
          {selectedCategory === "all" ? "All Categories" : selectedCategory}
        </span>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4" 
        />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleCategorySelect("all")}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                selectedCategory === "all" ? "bg-primary/10 text-primary" : "text-gray-700"
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  selectedCategory === category ? "bg-primary/10 text-primary" : "text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter