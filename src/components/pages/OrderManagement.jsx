import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { orderService } from "@/services/api/orderService"

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await orderService.getAll()
      setOrders(data)
    } catch (err) {
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const updatedOrder = await orderService.updateStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.Id === orderId ? updatedOrder : o))
      toast.success(`Order #${orderId} marked as ${newStatus}`)
    } catch (err) {
      toast.error(err.message || "Failed to update order status")
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed": return "success"
      case "pending": return "warning"
      case "cancelled": return "danger"
      default: return "secondary"
    }
  }

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  if (loading) return <Loading message="Loading orders..." />
  if (error) return <Error message={error} onRetry={loadOrders} />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-secondary mt-1">
            Track and manage customer orders
          </p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary">Filter:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["all", "pending", "completed"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {status}
                {status !== "all" && (
                  <span className="ml-1 text-xs">
                    ({orders.filter(o => o.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Empty 
          title="No orders found"
          message={statusFilter === "all" 
            ? "No orders have been placed yet" 
            : `No ${statusFilter} orders found`
          }
          icon="FileText"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <Card key={order.Id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      Order #{order.Id}
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </h3>
                    <p className="text-secondary text-sm mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <ApperIcon name="User" className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-secondary">Name:</span>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Email:</span>
                      <p className="font-medium">{order.customerEmail}</p>
                    </div>
                    <div>
                      <span className="text-secondary">Phone:</span>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <ApperIcon name="Package" className="w-4 h-4" />
                    Order Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.productName}</p>
                          <p className="text-xs text-secondary">
                            ${item.unitPrice.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-sm">
                          ${item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {order.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate(order.Id, "completed")}
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="CheckCircle" className="w-4 h-4" />
                      Mark as Completed
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusUpdate(order.Id, "cancelled")}
                      className="flex items-center gap-2"
                    >
                      <ApperIcon name="XCircle" className="w-4 h-4" />
                      Cancel Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderManagement