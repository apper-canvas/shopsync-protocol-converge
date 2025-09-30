import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ProductGrid from "@/components/organisms/ProductGrid"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"

const CustomerShop = ({ addToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

const handleAddToCart = (product) => {
    const stockQty = product.stock_quantity_c || product.stockQuantity || 0
    if (stockQty > 0) {
      addToCart(product)
      toast.success(`${product.name_c || product.name} added to cart!`, {
        icon: "🛒"
      })
    } else {
      toast.error("This product is out of stock")
    }
  }

  if (loading) return <Loading message="Loading products..." />
  if (error) return <Error message={error} onRetry={loadProducts} />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center py-8 bg-gradient-to-r from-primary/10 via-blue-50 to-primary/10 rounded-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="ShoppingBag" className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to ShopSync</h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Discover amazing products with real-time inventory updates. 
          Add items to your cart and enjoy a seamless shopping experience.
        </p>
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-secondary">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
            Real-time Stock Updates
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Truck" className="w-5 h-5 text-blue-500" />
            Fast Processing
          </div>
          <div className="flex items-center gap-2">
            <ApperIcon name="Shield" className="w-5 h-5 text-purple-500" />
            Secure Shopping
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onAddToCart={handleAddToCart}
        onRefresh={loadProducts}
        isManager={false}
      />
    </div>
  )
}

export default CustomerShop