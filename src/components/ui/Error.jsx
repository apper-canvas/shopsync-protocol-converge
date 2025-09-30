import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          
          <p className="text-secondary mb-6">
            {message}
          </p>
          
          {onRetry && (
            <Button onClick={onRetry} className="flex items-center gap-2 mx-auto">
              <ApperIcon name="RefreshCw" className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Error