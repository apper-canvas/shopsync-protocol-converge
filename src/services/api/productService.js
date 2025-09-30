import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const productService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_quantity_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await apperClient.fetchRecords('product_c', params)
      
      if (!response?.data?.length) {
        return []
      }

      // Transform data to match UI expectations
      return response.data.map(product => ({
        ...product,
        name: product.name_c || product.Name || '',
        description: product.description_c || '',
        price: product.price_c || 0,
        stockQuantity: product.stock_quantity_c || 0,
        category: product.category_c || '',
        imageUrl: product.image_url_c || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center`,
        createdAt: product.created_at_c || product.CreatedOn,
        updatedAt: product.updated_at_c || product.ModifiedOn
      }))
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error.message)
      throw new Error("Failed to load products")
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_quantity_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      }

      const response = await apperClient.getRecordById('product_c', parseInt(id), params)
      
      if (!response?.data) {
        throw new Error("Product not found")
      }

      const product = response.data
      return {
        ...product,
        name: product.name_c || product.Name || '',
        description: product.description_c || '',
        price: product.price_c || 0,
        stockQuantity: product.stock_quantity_c || 0,
        category: product.category_c || '',
        imageUrl: product.image_url_c || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center`,
        createdAt: product.created_at_c || product.CreatedOn,
        updatedAt: product.updated_at_c || product.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error?.response?.data?.message || error.message)
      throw new Error("Failed to load product")
    }
  },

  async create(productData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Name: productData.name || '',
          name_c: productData.name || '',
          description_c: productData.description || '',
          price_c: parseFloat(productData.price) || 0,
          stock_quantity_c: parseInt(productData.stockQuantity) || 0,
          category_c: productData.category || '',
          image_url_c: productData.imageUrl || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center`,
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      }

      const response = await apperClient.createRecord('product_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} products:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message || error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const newProduct = successful[0].data
          return {
            ...newProduct,
            name: newProduct.name_c || newProduct.Name || '',
            description: newProduct.description_c || '',
            price: newProduct.price_c || 0,
            stockQuantity: newProduct.stock_quantity_c || 0,
            category: newProduct.category_c || '',
            imageUrl: newProduct.image_url_c || '',
            createdAt: newProduct.created_at_c || newProduct.CreatedOn,
            updatedAt: newProduct.updated_at_c || newProduct.ModifiedOn
          }
        }
      }
      
      throw new Error("Failed to create product")
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error.message)
      throw new Error("Failed to create product")
    }
  },

  async update(id, productData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: productData.name || '',
          name_c: productData.name || '',
          description_c: productData.description || '',
          price_c: parseFloat(productData.price) || 0,
          stock_quantity_c: parseInt(productData.stockQuantity) || 0,
          category_c: productData.category || '',
          image_url_c: productData.imageUrl || '',
          updated_at_c: new Date().toISOString()
        }]
      }

      const response = await apperClient.updateRecord('product_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} products:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error.message || error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const updatedProduct = successful[0].data
          return {
            ...updatedProduct,
            name: updatedProduct.name_c || updatedProduct.Name || '',
            description: updatedProduct.description_c || '',
            price: updatedProduct.price_c || 0,
            stockQuantity: updatedProduct.stock_quantity_c || 0,
            category: updatedProduct.category_c || '',
            imageUrl: updatedProduct.image_url_c || '',
            createdAt: updatedProduct.created_at_c || updatedProduct.CreatedOn,
            updatedAt: updatedProduct.updated_at_c || updatedProduct.ModifiedOn
          }
        }
      }
      
      throw new Error("Failed to update product")
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error.message)
      throw new Error("Failed to update product")
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = { 
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('product_c', params)

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} products:`, JSON.stringify(failed))
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        return successful.length > 0
      }
      
      return true
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error.message)
      throw new Error("Failed to delete product")
    }
  },

  async updateStock(id, quantity) {
    try {
      // Get current product
      const product = await this.getById(id)
      const newStockQuantity = Math.max(0, product.stockQuantity + quantity)
      
      // Update with new stock quantity
      return await this.update(id, { 
        ...product,
        stockQuantity: newStockQuantity
      })
    } catch (error) {
      console.error("Error updating stock:", error?.response?.data?.message || error.message)
      throw new Error("Failed to update stock")
    }
  },

  async getLowStockProducts(threshold = 10) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_quantity_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "image_url_c"}}
        ],
        where: [{"FieldName": "stock_quantity_c", "Operator": "LessThanOrEqualTo", "Values": [threshold.toString()]}],
        orderBy: [{"fieldName": "stock_quantity_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      }

      const response = await apperClient.fetchRecords('product_c', params)
      
      if (!response?.data?.length) {
        return []
      }

      return response.data.map(product => ({
        ...product,
        name: product.name_c || product.Name || '',
        description: product.description_c || '',
        price: product.price_c || 0,
        stockQuantity: product.stock_quantity_c || 0,
        category: product.category_c || '',
        imageUrl: product.image_url_c || ''
      }))
    } catch (error) {
      console.error("Error fetching low stock products:", error?.response?.data?.message || error.message)
      return []
}
  }
}