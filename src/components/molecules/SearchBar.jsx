import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  placeholder = "Search notes and tasks...",
  onSearch,
  onFilter,
  filters = {},
  className = "",
  availableTags = []
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

            <input
              type="text"
              placeholder="Add tags (comma separated)"
              value={filters.tags ? filters.tags.join(', ') : ''}
              onChange={(e) => {
                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                handleFilterChange('tags', tags)
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="flex items-center space-x-2">
              <input
                type="date"
                placeholder="Start date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => handleFilterChange('dateRange', { 
                  ...filters.dateRange, 
                  start: e.target.value 
                })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                placeholder="End date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => handleFilterChange('dateRange', { 
                  ...filters.dateRange, 
                  end: e.target.value 
                })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {(filters.tags?.length > 0 || filters.dateRange?.start || filters.dateRange?.end || filters.folder) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.tags?.map((tag, index) => (
                <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                  <span>{tag}</span>
                  <button
                    onClick={() => {
                      const newTags = filters.tags.filter((_, i) => i !== index)
                      handleFilterChange('tags', newTags)
                    }}
                    className="hover:bg-primary-200 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" size={10} />
                  </button>
                </span>
              ))}
              
              {filters.dateRange?.start && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">
                  <span>From: {filters.dateRange.start}</span>
                  <button
                    onClick={() => handleFilterChange('dateRange', { 
                      ...filters.dateRange, 
                      start: '' 
                    })}
                    className="hover:bg-accent-200 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" size={10} />
                  </button>
                </span>
              )}
              
              {filters.dateRange?.end && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-accent-100 text-accent-700 rounded-full text-xs">
                  <span>To: {filters.dateRange.end}</span>
                  <button
                    onClick={() => handleFilterChange('dateRange', { 
                      ...filters.dateRange, 
                      end: '' 
                    })}
                    className="hover:bg-accent-200 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" size={10} />
                  </button>
                </span>
              )}
              
              {filters.folder && (
                <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <span>Folder: {filters.folder}</span>
                  <button
                    onClick={() => handleFilterChange('folder', '')}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" size={10} />
                  </button>
                </span>
              )}
            </div>
          )}

          {(filters.tags?.length > 0 || filters.dateRange?.start || filters.dateRange?.end || filters.folder || filters.type) && (

<div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-gray-500">
                {[
                  filters.tags?.length > 0 && `${filters.tags.length} tags`,
                  filters.dateRange?.start && 'start date',
                  filters.dateRange?.end && 'end date', 
                  filters.folder && 'folder',
                  filters.type && 'type'
                ].filter(Boolean).join(', ')} active
              </span>
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