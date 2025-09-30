import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const ModeToggle = ({ userMode, setUserMode }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <Button
        variant={userMode === "manager" ? "default" : "ghost"}
        size="sm"
        onClick={() => setUserMode("manager")}
        className="flex items-center gap-2 rounded-md"
      >
        <ApperIcon name="Settings" className="w-4 h-4" />
        Manager
      </Button>
      <Button
        variant={userMode === "customer" ? "default" : "ghost"}
        size="sm"
        onClick={() => setUserMode("customer")}
        className="flex items-center gap-2 rounded-md"
      >
        <ApperIcon name="ShoppingBag" className="w-4 h-4" />
        Customer
      </Button>
    </div>
  )
}

export default ModeToggle