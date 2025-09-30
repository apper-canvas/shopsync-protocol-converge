import { useState, useEffect } from "react"
import ProductCard from "@/components/molecules/ProductCard"
import SearchBar from "@/components/molecules/SearchBar"
import CategoryFilter from "@/components/molecules/CategoryFilter"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"

const ProductGrid = ({ products, loading, error, onAddToCart, onEdit, isManager = false, onRefresh }) => {
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category))].sort()

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={onRefresh} />
  
  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Results Summary */}
      <div className="text-sm text-secondary">
        {searchTerm || selectedCategory !== "all" ? (
          <span>
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </span>
        ) : (
          <span>{products.length} products available</span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <Empty 
          title={searchTerm || selectedCategory !== "all" ? "No products found" : "No products available"}
          message={searchTerm || selectedCategory !== "all" 
            ? "Try adjusting your search or filter criteria" 
            : "Add some products to get started"
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.Id}
              product={product}
              onAddToCart={onAddToCart}
              onEdit={onEdit}
              isManager={isManager}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGrid