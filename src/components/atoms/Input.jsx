import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
  const errorClasses = error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"
  const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-display">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} flex items-center ${iconPosition === 'left' ? 'pl-3' : 'pr-3'}`}>
            <ApperIcon name={icon} size={18} className="text-gray-400" />
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <ApperIcon name="AlertCircle" size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

export default Input