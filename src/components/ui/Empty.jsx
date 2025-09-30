import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing here yet", 
  actionLabel = "Get Started",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-secondary mb-6">
            {message}
          </p>
          
          {onAction && (
            <Button onClick={onAction} className="flex items-center gap-2 mx-auto">
              <ApperIcon name="Plus" className="w-4 h-4" />
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Empty