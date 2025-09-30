import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "./store/userSlice";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import Layout from "@/components/organisms/Layout";
import CustomerShop from "@/components/pages/CustomerShop";
import ManagerDashboard from "@/components/pages/ManagerDashboard";
import OrderConfirmation from "@/components/pages/OrderConfirmation";
import OrderManagement from "@/components/pages/OrderManagement";
import ProductManagement from "@/components/pages/ProductManagement";
import ShoppingCart from "@/components/pages/ShoppingCart";

// Create auth context
export const AuthContext = createContext(null)

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [userMode, setUserMode] = useState("customer")
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true)
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search
        let redirectPath = new URLSearchParams(window.location.search).get('redirect')
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error')
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath)
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath)
            } else {
              navigate('/')
            }
          } else {
            navigate('/')
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))))
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            )
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`)
            } else {
              navigate(currentPath)
            }
          } else if (isAuthPage) {
            navigate(currentPath)
          } else {
            navigate('/login')
          }
          dispatch(clearUser())
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error)
      }
    })
  }, [])// No props and state should be bound
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }

  // Cart management functions
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
        productName: product.name_c,
        quantity,
        unitPrice: product.price_c,
        subtotal: product.price_c * quantity,
        imageUrl: product.image_url_c
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
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>
  }
  
return (
    <BrowserRouter>
      <AuthContext.Provider value={authMethods}>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/" element={<Layout userMode={userMode} setUserMode={setUserMode} cartItems={cartItems} />}>
              <Route index element={<div className="text-center py-8">
                <h1 className="text-2xl font-bold mb-4">Welcome to ShopSync</h1>
                <p className="text-gray-600 mb-6">Choose your mode to get started</p>
                {userMode === "manager" ? (
                  <div className="space-y-4">
                    <a href="/dashboard" className="block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                      Go to Manager Dashboard
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <a href="/shop" className="block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                      Start Shopping
                    </a>
                  </div>
                )}
              </div>} />
              {/* Manager Routes */}
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              {/* Customer Routes */}
              <Route path="shop" element={<CustomerShop addToCart={addToCart} />} />
              <Route path="cart" element={<ShoppingCart cartItems={cartItems} updateCartItem={updateCartItem} removeFromCart={removeFromCart} clearCart={clearCart} cartTotal={cartTotal} />} />
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
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

export default App