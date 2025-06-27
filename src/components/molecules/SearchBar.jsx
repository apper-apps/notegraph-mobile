import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  placeholder = "Search notes and tasks...",
  onSearch,
  onFilter,
  filters = {},
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleFilterChange = (filterType, value) => {
    onFilter?.({ ...filters, [filterType]: value })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <Input
          icon="Search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pr-12"
        />
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-150"
        >
          <ApperIcon name="Filter" size={18} className="text-gray-400" />
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-lg p-4 shadow-sm space-y-3"
        >
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="note">Notes</option>
              <option value="task">Tasks</option>
            </select>

            <select
              value={filters.folder || ''}
              onChange={(e) => handleFilterChange('folder', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Folders</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="projects">Projects</option>
            </select>

            <input
              type="date"
              value={filters.date || ''}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {Object.keys(filters).some(key => filters[key]) && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">Active filters</span>
              <button
                onClick={() => onFilter?.({})}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default SearchBar