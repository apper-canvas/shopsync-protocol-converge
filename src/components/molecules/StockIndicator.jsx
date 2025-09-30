import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const StockIndicator = ({ stockQuantity, showText = true }) => {
  const getStockStatus = (quantity) => {
    if (quantity === 0) return { variant: "danger", text: "Out of Stock", icon: "XCircle" }
    if (quantity <= 10) return { variant: "warning", text: "Low Stock", icon: "AlertTriangle" }
    return { variant: "success", text: "In Stock", icon: "CheckCircle" }
  }

  const status = getStockStatus(stockQuantity)

  return (
    <div className="flex items-center gap-2">
      <Badge variant={status.variant} className="flex items-center gap-1">
        <ApperIcon name={status.icon} className="w-3 h-3" />
        {showText ? status.text : stockQuantity}
      </Badge>
      {showText && (
        <span className="text-sm text-secondary">
          {stockQuantity} units
        </span>
      )}
    </div>
  )
}

export default StockIndicator