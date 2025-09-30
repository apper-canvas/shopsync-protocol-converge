import { Card, CardHeader, CardContent, CardFooter } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const OrderSummary = ({ items, total, onCheckout, loading = false }) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const tax = total * 0.08 // 8% tax
  const finalTotal = total + tax

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ApperIcon name="ShoppingCart" className="w-5 h-5" />
          Order Summary
        </h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary">Items ({itemCount})</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          {items.slice(0, 3).map(item => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <div className="flex-1">
                <span className="font-medium">{item.productName}</span>
                <span className="text-secondary ml-2">×{item.quantity}</span>
              </div>
              <span>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          {items.length > 3 && (
            <div className="text-xs text-secondary text-center py-2">
              And {items.length - 3} more items...
            </div>
          )}
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-primary">${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={onCheckout}
          disabled={items.length === 0 || loading}
          className="w-full flex items-center gap-2"
          size="lg"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ApperIcon name="CreditCard" className="w-4 h-4" />
              Proceed to Checkout
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default OrderSummary