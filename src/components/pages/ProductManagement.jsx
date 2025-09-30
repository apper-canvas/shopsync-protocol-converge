import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import ProductGrid from "@/components/organisms/ProductGrid"
import ProductFormModal from "@/components/organisms/ProductFormModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

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

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = await productService.update(editingProduct.Id, productData)
        setProducts(prev => prev.map(p => p.Id === editingProduct.Id ? updatedProduct : p))
        toast.success("Product updated successfully!")
      } else {
        // Create new product
        const newProduct = await productService.create(productData)
        setProducts(prev => [newProduct, ...prev])
        toast.success("Product added successfully!")
      }
    } catch (err) {
      toast.error(err.message || "Failed to save product")
      throw err // Re-throw to prevent modal from closing
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      await productService.delete(productId)
      setProducts(prev => prev.filter(p => p.Id !== productId))
      toast.success("Product deleted successfully!")
    } catch (err) {
      toast.error(err.message || "Failed to delete product")
    }
  }

  if (loading) return <Loading message="Loading products..." />
  if (error) return <Error message={error} onRetry={loadProducts} />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-secondary mt-1">
            Manage your inventory and product catalog
          </p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onEdit={handleEditProduct}
        onRefresh={loadProducts}
        isManager={true}
      />

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  )
}

export default ProductManagement