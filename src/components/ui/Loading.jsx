const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Product Grid Skeleton */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm animate-pulse">
              {/* Image placeholder */}
              <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
              
              {/* Content placeholder */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                
                {/* Price and stock */}
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
                
                {/* Button */}
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading message */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-secondary font-medium">{message}</span>
        </div>
      </div>
    </div>
  )
}

export default Loading