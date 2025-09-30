import { useState } from "react"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    // Real-time search as user types
    onSearch(value)
  }

  return (
    <form onSearch={handleSearch} className="relative flex items-center">
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 pr-4"
        />
      </div>
      {searchTerm && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setSearchTerm("")
            onSearch("")
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </Button>
      )}
    </form>
  )
}

export default SearchBar