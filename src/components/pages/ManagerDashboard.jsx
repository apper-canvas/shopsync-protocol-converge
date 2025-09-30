import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { productService } from "@/services/api/productService"
import { orderService } from "@/services/api/orderService"

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockProducts: [],
    recentOrders: [],
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")

      const [products, lowStock, recentOrders, revenue, pendingOrdersData] = await Promise.all([
        productService.getAll(),
        productService.getLowStockProducts(10),
        orderService.getRecentOrders(5),
        orderService.getTotalRevenue(),
        orderService.getByStatus("pending")
      ])

      setDashboardData({
        totalProducts: products.length,
        lowStockProducts: lowStock,
        recentOrders,
        totalRevenue: revenue,
        pendingOrders: pendingOrdersData.length
      })
    } catch (err) {
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading message="Loading dashboard..." />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  const stats = [
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: "Package",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Low Stock Items",
      value: dashboardData.lowStockProducts.length,
      icon: "AlertTriangle",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Pending Orders",
      value: dashboardData.pendingOrders,
      icon: "Clock",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Total Revenue",
      value: `$${dashboardData.totalRevenue.toFixed(2)}`,
      icon: "DollarSign",
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-secondary mt-1">Overview of your store performance</p>
        </div>
        <div className="flex gap-3">
          <Link to="/products">
            <Button variant="outline" className="flex items-center gap-2">
              <ApperIcon name="Package" className="w-4 h-4" />
              Manage Products
            </Button>
          </Link>
          <Link to="/orders">
            <Button className="flex items-center gap-2">
              <ApperIcon name="FileText" className="w-4 h-4" />
              View Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <Link to="/orders">
              <Button variant="ghost" size="sm">
                View All
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {dashboardData.recentOrders.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                <ApperIcon name="FileText" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentOrders.map(order => (
                  <div key={order.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">#{order.Id}</p>
                        <Badge variant={order.status === "completed" ? "success" : "warning"}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-secondary mt-1">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${order.totalAmount.toFixed(2)}</p>
                      <p className="text-xs text-secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">Low Stock Alert</h3>
            <Link to="/products">
              <Button variant="ghost" size="sm">
                Manage Stock
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {dashboardData.lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-secondary">
                <ApperIcon name="CheckCircle" className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p>All products are well stocked!</p>
              </div>
            ) : (
              <div className="space-y-3">
{dashboardData.lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.Id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name_c || product.name}</p>
                      <p className="text-xs text-secondary">{product.category_c || product.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={(product.stock_quantity_c || product.stockQuantity || 0) === 0 ? "danger" : "warning"}>
                        {product.stock_quantity_c || product.stockQuantity || 0} left
                      </Badge>
                    </div>
                  </div>
                ))}
                {dashboardData.lowStockProducts.length > 5 && (
                  <p className="text-xs text-center text-secondary py-2">
                    And {dashboardData.lowStockProducts.length - 5} more items need attention
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ManagerDashboard