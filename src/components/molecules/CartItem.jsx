import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 0
    onUpdateQuantity(item.productId, newQuantity)
  }

  const incrementQuantity = () => {
    onUpdateQuantity(item.productId, item.quantity + 1)
  }

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1)
    }
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            <img
src={item.imageUrl || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center`}
              alt={item.productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center`
              }}
            />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              {item.productName}
            </h4>
            <p className="text-sm text-secondary">
              ${item.unitPrice.toFixed(2)} each
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={item.quantity <= 1}
              className="w-8 h-8"
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </Button>
            
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-16 text-center"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="w-8 h-8"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-right">
            <p className="font-semibold text-lg">
              ${item.subtotal.toFixed(2)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.productId)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 w-8 h-8 mt-1"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CartItem