import { Link, useLocation } from "react-router-dom"
import ModeToggle from "@/components/molecules/ModeToggle"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ userMode, setUserMode, cartItems = [] }) => {
  const location = useLocation()
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const managerLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { to: "/products", label: "Products", icon: "Package" },
    { to: "/orders", label: "Orders", icon: "FileText" },
  ]

  const customerLinks = [
    { to: "/shop", label: "Shop", icon: "ShoppingBag" },
    { to: "/cart", label: "Cart", icon: "ShoppingCart" },
  ]

  const links = userMode === "manager" ? managerLinks : customerLinks

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ShopSync</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <ApperIcon name={link.icon} className="w-4 h-4" />
                {link.label}
                {link.to === "/cart" && cartItemCount > 0 && (
                  <Badge variant="danger" className="ml-1">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Mode Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <ModeToggle userMode={userMode} setUserMode={setUserMode} />
            
            {/* Mobile Cart Icon for Customer Mode */}
            {userMode === "customer" && (
              <Link to="/cart" className="md:hidden relative">
                <Button variant="ghost" size="icon">
                  <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <Badge variant="danger" className="absolute -top-2 -right-2 text-xs min-w-[20px] h-5 flex items-center justify-center">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-3">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <ApperIcon name={link.icon} className="w-4 h-4" />
                {link.label}
                {link.to === "/cart" && cartItemCount > 0 && (
                  <Badge variant="danger" className="ml-1">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header