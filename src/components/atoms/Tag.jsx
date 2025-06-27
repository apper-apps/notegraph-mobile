import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Tag = ({ 
  children, 
  color = 'primary', 
  size = 'sm', 
  removable = false, 
  onRemove,
  className = '',
  ...props 
}) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    accent: 'bg-accent-100 text-accent-700 hover:bg-accent-200',
    green: 'bg-green-100 text-green-700 hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    pink: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  }
  
  const baseClasses = `inline-flex items-center font-medium rounded-full transition-colors duration-150 ${colors[color]} ${sizes[size]} ${className}`

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={baseClasses}
      {...props}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors duration-150"
        >
          <ApperIcon name="X" size={12} />
        </button>
      )}
    </motion.span>
  )
}

export default Tag