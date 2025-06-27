import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-md hover:shadow-lg",
    secondary: "bg-white text-primary-700 border border-primary-300 hover:bg-primary-50 focus:ring-primary-500 shadow-sm hover:shadow-md",
    outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm hover:shadow-md",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-md hover:shadow-lg"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  }

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" size={iconSizes[size]} className="animate-spin mr-2" />
      ) : (
        icon && iconPosition === 'left' && (
          <ApperIcon name={icon} size={iconSizes[size]} className="mr-2" />
        )
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={iconSizes[size]} className="ml-2" />
      )}
    </motion.button>
  )
}

export default Button