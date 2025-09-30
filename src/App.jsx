import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { useState } from "react"
import Layout from "@/components/organisms/Layout"
import ManagerDashboard from "@/components/pages/ManagerDashboard"
import ProductManagement from "@/components/pages/ProductManagement"
import OrderManagement from "@/components/pages/OrderManagement"
import CustomerShop from "@/components/pages/CustomerShop"
import ShoppingCart from "@/components/pages/ShoppingCart"
import OrderConfirmation from "@/components/pages/OrderConfirmation"

function App() {
  const [userMode, setUserMode] = useState("customer")
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === product.Id)
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.Id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, {
        productId: product.Id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        subtotal: product.price * quantity,
        imageUrl: product.imageUrl
      }]
    })
  }

  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity, subtotal: item.unitPrice * quantity }
          : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Layout userMode={userMode} setUserMode={setUserMode} cartItems={cartItems} />}>
            <Route index element={<Navigate to={userMode === "manager" ? "/dashboard" : "/shop"} replace />} />
            
            {/* Manager Routes */}
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            
            {/* Customer Routes */}
            <Route path="shop" element={<CustomerShop addToCart={addToCart} />} />
            <Route path="cart" element={
              <ShoppingCart 
                cartItems={cartItems}
                updateCartItem={updateCartItem}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                cartTotal={cartTotal}
              />
            } />
            <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  )
}

export default App