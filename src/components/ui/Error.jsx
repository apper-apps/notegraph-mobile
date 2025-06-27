import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600 max-w-md">{message}</p>
        </div>

        {showRetry && onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-150 flex items-center space-x-2"
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