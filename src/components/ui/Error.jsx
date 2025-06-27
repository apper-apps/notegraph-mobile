import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-soft border border-red-100 p-8 text-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-white" />
        </div>
        
<div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 font-display">Oops! Something went wrong</h3>
          <p className="text-gray-600 max-w-md">{message}</p>
        </div>

        {showRetry && onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl font-medium"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Try Again</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Error