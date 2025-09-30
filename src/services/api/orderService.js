import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";
import React from "react";
import Error from "@/components/ui/Error";

export const orderService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await apperClient.fetchRecords('order_c', params)
      
      if (!response?.data?.length) {
        return []
      }

      return response.data.map(order => ({
        ...order,
        customerName: order.customer_name_c || '',
        customerEmail: order.customer_email_c || '',
        customerPhone: order.customer_phone_c || '',
        totalAmount: order.total_amount_c || 0,
        status: order.status_c || 'pending',
        items: order.items_c ? JSON.parse(order.items_c) : [],
        createdAt: order.created_at_c || order.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error.message)
      throw new Error("Failed to load orders")
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById('order_c', parseInt(id), params)
      
      if (!response?.data) {
        throw new Error("Order not found")
      }

      const order = response.data
      return {
        ...order,
        customerName: order.customer_name_c || '',
        customerEmail: order.customer_email_c || '',
        customerPhone: order.customer_phone_c || '',
        totalAmount: order.total_amount_c || 0,
        status: order.status_c || 'pending',
        items: order.items_c ? JSON.parse(order.items_c) : [],
        createdAt: order.created_at_c || order.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error?.response?.data?.message || error.message)
      throw new Error("Failed to load order")
    }
  },

  async create(orderData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Update product stock first
      for (const item of orderData.items) {
        await productService.updateStock(item.productId, -item.quantity)
      }

      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Order-${Date.now()}`,
          customer_name_c: orderData.customerName || '',
          customer_email_c: orderData.customerEmail || '',
          customer_phone_c: orderData.customerPhone || '',
          total_amount_c: parseFloat(orderData.totalAmount) || 0,
          status_c: 'pending',
          items_c: JSON.stringify(orderData.items || []),
          created_at_c: new Date().toISOString()
        }]
      }

      const response = await apperClient.createRecord('order_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message || error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const newOrder = successful[0].data
          return {
            ...newOrder,
            customerName: newOrder.customer_name_c || '',
            customerEmail: newOrder.customer_email_c || '',
            customerPhone: newOrder.customer_phone_c || '',
            totalAmount: newOrder.total_amount_c || 0,
            status: newOrder.status_c || 'pending',
            items: newOrder.items_c ? JSON.parse(newOrder.items_c) : [],
            createdAt: newOrder.created_at_c || newOrder.CreatedOn
          }
        }
      }
      
      throw new Error("Failed to create order")
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error.message)
      throw new Error("Failed to create order")
    }
  },

  async updateStatus(id, status) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      }

      const response = await apperClient.updateRecord('order_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message || error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const updatedOrder = successful[0].data
          return {
            ...updatedOrder,
            customerName: updatedOrder.customer_name_c || '',
            customerEmail: updatedOrder.customer_email_c || '',
            customerPhone: updatedOrder.customer_phone_c || '',
            totalAmount: updatedOrder.total_amount_c || 0,
            status: updatedOrder.status_c || 'pending',
            items: updatedOrder.items_c ? JSON.parse(updatedOrder.items_c) : [],
            createdAt: updatedOrder.created_at_c || updatedOrder.CreatedOn
          }
        }
      }
      
      throw new Error("Failed to update order")
    } catch (error) {
      console.error("Error updating order status:", error?.response?.data?.message || error.message)
      throw new Error("Failed to update order")
    }
  },

  async getByStatus(status) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "ExactMatch", "Values": [status]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await apperClient.fetchRecords('order_c', params)
      
      if (!response?.data?.length) {
        return []
      }

      return response.data.map(order => ({
        ...order,
        customerName: order.customer_name_c || '',
        customerEmail: order.customer_email_c || '',
        customerPhone: order.customer_phone_c || '',
        totalAmount: order.total_amount_c || 0,
        status: order.status_c || 'pending',
        items: order.items_c ? JSON.parse(order.items_c) : [],
        createdAt: order.created_at_c || order.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching orders by status:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async getRecentOrders(limit = 5) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "customer_name_c"}},
          {"field": {"Name": "customer_email_c"}},
          {"field": {"Name": "customer_phone_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      }

      const response = await apperClient.fetchRecords('order_c', params)
      
      if (!response?.data?.length) {
        return []
      }

      return response.data.map(order => ({
        ...order,
        customerName: order.customer_name_c || '',
        customerEmail: order.customer_email_c || '',
        customerPhone: order.customer_phone_c || '',
        totalAmount: order.total_amount_c || 0,
        status: order.status_c || 'pending',
        items: order.items_c ? JSON.parse(order.items_c) : [],
        createdAt: order.created_at_c || order.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching recent orders:", error?.response?.data?.message || error.message)
      return []
    }
  },

  async getTotalRevenue() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "total_amount_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "ExactMatch", "Values": ["completed"]}],
        pagingInfo: {"limit": 1000, "offset": 0}
      }

      const response = await apperClient.fetchRecords('order_c', params)
      
      if (!response?.data?.length) {
        return 0
      }

      return response.data.reduce((sum, order) => sum + (order.total_amount_c || 0), 0)
    } catch (error) {
      console.error("Error fetching total revenue:", error?.response?.data?.message || error.message)
      return 0
    }
}
}