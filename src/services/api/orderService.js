import ordersData from "@/services/mockData/orders.json"
import { productService } from "@/services/api/productService"

// Simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let orders = [...ordersData]

export const orderService = {
  async getAll() {
    await delay(300)
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getById(id) {
    await delay(200)
    const order = orders.find(o => o.Id === parseInt(id))
    if (!order) {
      throw new Error("Order not found")
    }
    return { ...order }
  },

  async create(orderData) {
    await delay(500)
    
    // Update product stock
    for (const item of orderData.items) {
      await productService.updateStock(item.productId, -item.quantity)
    }
    
    const newOrder = {
      Id: Math.max(...orders.map(o => o.Id), 0) + 1,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString()
    }
    
    orders.unshift(newOrder)
    return { ...newOrder }
  },

  async updateStatus(id, status) {
    await delay(300)
    const index = orders.findIndex(o => o.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Order not found")
    }
    
    orders[index].status = status
    return { ...orders[index] }
  },

  async getByStatus(status) {
    await delay(250)
    return orders.filter(o => o.status === status).map(o => ({ ...o }))
  },

  async getRecentOrders(limit = 5) {
    await delay(200)
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(o => ({ ...o }))
  },

  async getTotalRevenue() {
    await delay(200)
    const completedOrders = orders.filter(o => o.status === "completed")
    return completedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  }
}