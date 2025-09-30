import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/atoms/Card";
import { orderService } from "@/services/api/orderService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import CartItem from "@/components/molecules/CartItem";
import OrderSummary from "@/components/organisms/OrderSummary";
import Empty from "@/components/ui/Empty";

const ShoppingCart = ({ cartItems, updateCartItem, removeFromCart, clearCart, cartTotal }) => {
  const navigate = useNavigate()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!customerInfo.name.trim()) newErrors.name = "Name is required"
    if (!customerInfo.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!customerInfo.phone.trim()) newErrors.phone = "Phone number is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setIsProcessing(true)

try {
      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        items: cartItems,
        totalAmount: cartTotal
      }

      const newOrder = await orderService.create(orderData)

      // Clear cart and redirect to confirmation
      clearCart()
      toast.success("Order placed successfully!")
      navigate(`/order-confirmation/${newOrder.Id}`)
      
    } catch (err) {
      toast.error(err.message || "Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <Empty
        title="Your cart is empty"
        message="Browse our products and add items to your cart to get started"
        actionLabel="Start Shopping"
        onAction={() => navigate("/shop")}
        icon="ShoppingCart"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-secondary mt-1">
            {cartItems.length} items in your cart
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          Continue Shopping
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items & Customer Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Cart Items</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                Clear Cart
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateCartItem}
                  onRemove={removeFromCart}
                />
              ))}
            </CardContent>
          </Card>

          {/* Customer Information Form */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ApperIcon name="User" className="w-5 h-5" />
                Customer Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary
            items={cartItems}
            total={cartTotal}
            onCheckout={handleCheckout}
            loading={isProcessing}
          />
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart