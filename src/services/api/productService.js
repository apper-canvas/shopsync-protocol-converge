import productsData from "@/services/mockData/products.json"

// Simulate async delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let products = [...productsData]

export const productService = {
  async getAll() {
    await delay(300)
    return [...products]
  },

  async getById(id) {
    await delay(200)
    const product = products.find(p => p.Id === parseInt(id))
    if (!product) {
      throw new Error("Product not found")
    }
    return { ...product }
  },

  async create(productData) {
    await delay(400)
    const newProduct = {
      Id: Math.max(...products.map(p => p.Id)) + 1,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.push(newProduct)
    return { ...newProduct }
  },

  async update(id, productData) {
    await delay(400)
    const index = products.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Product not found")
    }
    
    const updatedProduct = {
      ...products[index],
      ...productData,
      updatedAt: new Date().toISOString()
    }
    products[index] = updatedProduct
    return { ...updatedProduct }
  },

  async delete(id) {
    await delay(300)
    const index = products.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Product not found")
    }
    
    const deletedProduct = products[index]
    products.splice(index, 1)
    return { ...deletedProduct }
  },

  async updateStock(id, quantity) {
    await delay(200)
    const index = products.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Product not found")
    }
    
    products[index].stockQuantity = Math.max(0, products[index].stockQuantity + quantity)
    products[index].updatedAt = new Date().toISOString()
    return { ...products[index] }
  },

  async getLowStockProducts(threshold = 10) {
    await delay(250)
    return products.filter(p => p.stockQuantity <= threshold).map(p => ({ ...p }))
  }
}