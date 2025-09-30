import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { orderService } from "@/services/api/orderService"

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (orderId) {
      loadOrder()
    }
  }, [orderId])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError("")
      const orderData = await orderService.getById(orderId)
      setOrder(orderData)
    } catch (err) {
      setError(err.message || "Failed to load order details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading order details..." />
  if (error) return <Error message={error} onRetry={loadOrder} />
  if (!order) return <Error message="Order not found" />

const estimatedDelivery = new Date(order.created_at_c || order.createdAt)
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3) // 3 days from order date

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="CheckCircle" className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-secondary text-lg">
          Thank you for your order. We've received your purchase and will process it shortly.
        </p>
      </div>

      {/* Order Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
Order #{order.Id}
                <Badge variant="warning">
                  {order.status_c || order.status}
                </Badge>
              </h2>
              <p className="text-secondary text-sm mt-1">
                Placed on {new Date(order.created_at_c || order.createdAt).toLocaleDateString()} at {new Date(order.created_at_c || order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">
                ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ApperIcon name="User" className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-secondary">Name:</span>
<p className="font-medium">{order.customer_name_c || order.customerName}</p>
              </div>
              <div>
                <span className="text-secondary">Email:</span>
                <p className="font-medium">{order.customer_email_c || order.customerEmail}</p>
              </div>
              <div>
                <span className="text-secondary">Phone:</span>
                <p className="font-medium">{order.customer_phone_c || order.customerPhone}</p>
              </div>
              <div>
                <span className="text-secondary">Estimated Delivery:</span>
                <p className="font-medium text-green-600">
                  {estimatedDelivery.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ApperIcon name="Package" className="w-4 h-4" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-secondary">
                      ${item.unitPrice.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
<span>${(order.total_amount_c || order.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${((order.total_amount_c || order.totalAmount || 0) * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span className="text-primary">${((order.total_amount_c || order.totalAmount || 0) * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate("/shop")}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ApperIcon name="ShoppingBag" className="w-4 h-4" />
            Continue Shopping
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <ApperIcon name="Printer" className="w-4 h-4" />
            Print Order
          </Button>
        </CardFooter>
      </Card>

      {/* What's Next Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Clock" className="w-5 h-5" />
            What happens next?
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-secondary">We'll prepare your items for shipping within 1-2 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Quality Check</p>
                <p className="text-secondary">Each item is carefully inspected before packaging.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Delivery</p>
                <p className="text-secondary">Your order will be delivered by {estimatedDelivery.toLocaleDateString()}.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderConfirmation