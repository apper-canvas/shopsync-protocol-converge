import { Card, CardContent, CardFooter } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import StockIndicator from "@/components/molecules/StockIndicator"
import ApperIcon from "@/components/ApperIcon"

const ProductCard = ({ product, onAddToCart, onEdit, isManager = false }) => {
  const handleAddToCart = () => {
    if (product.stockQuantity > 0) {
      onAddToCart(product)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center`
          }}
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
          <Badge variant="secondary" className="ml-2 text-xs">
            {product.category}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <StockIndicator stockQuantity={product.stockQuantity} showText={false} />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isManager ? (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center gap-2"
            >
              <ApperIcon name="Edit" className="w-4 h-4" />
              Edit
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="w-full flex items-center gap-2"
          >
            <ApperIcon name="ShoppingCart" className="w-4 h-4" />
            {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ProductCard