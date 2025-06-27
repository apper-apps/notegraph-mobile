import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FolderTree = ({ 
  folders = [], 
  selectedFolder, 
  onFolderSelect, 
  onFolderCreate,
  onFolderEdit,
  onFolderDelete,
  className = "" 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [editingFolder, setEditingFolder] = useState(null)
  const [newFolderName, setNewFolderName] = useState('')

  const toggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleFolderEdit = (folder) => {
    setEditingFolder(folder.id)
    setNewFolderName(folder.name)
  }

  const handleFolderSave = () => {
    if (newFolderName.trim()) {
      onFolderEdit?.(editingFolder, newFolderName.trim())
      setEditingFolder(null)
      setNewFolderName('')
    }
  }

  const handleFolderCancel = () => {
    setEditingFolder(null)
    setNewFolderName('')
  }

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders.has(folder.id)
    const isSelected = selectedFolder === folder.id
    const isEditing = editingFolder === folder.id
    const hasChildren = folder.children && folder.children.length > 0

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center space-x-2 py-2 px-2 rounded-md cursor-pointer transition-colors duration-150 ${
            isSelected ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => !isEditing && onFolderSelect?.(folder.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFolder(folder.id)
              }}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors duration-150"
            >
              <ApperIcon 
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                size={14} 
                className="text-gray-500"
              />
            </button>
          )}
          
          <ApperIcon 
            name="Folder" 
            size={16} 
            className={isSelected ? 'text-primary-600' : 'text-gray-500'}
          />
          
          {isEditing ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFolderSave()
                  if (e.key === 'Escape') handleFolderCancel()
                }}
                className="flex-1 px-2 py-1 text-sm border border-primary-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                autoFocus
              />
              <button
                onClick={handleFolderSave}
                className="p-1 hover:bg-green-100 rounded transition-colors duration-150"
              >
                <ApperIcon name="Check" size={12} className="text-green-600" />
              </button>
              <button
                onClick={handleFolderCancel}
                className="p-1 hover:bg-red-100 rounded transition-colors duration-150"
              >
                <ApperIcon name="X" size={12} className="text-red-600" />
              </button>
            </div>
          ) : (
            <>
              <span className="flex-1 text-sm font-medium">{folder.name}</span>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFolderEdit(folder)
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors duration-150"
                >
                  <ApperIcon name="Edit2" size={12} className="text-gray-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onFolderDelete?.(folder.id)
                  }}
                  className="p-1 hover:bg-red-100 rounded transition-colors duration-150"
                >
                  <ApperIcon name="Trash2" size={12} className="text-gray-500 hover:text-red-600" />
                </button>
              </div>
            </>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {folder.children.map(child => renderFolder(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 font-display">Folders</h3>
        <button
          onClick={() => onFolderCreate?.()}
          className="p-1 hover:bg-primary-100 rounded transition-colors duration-150"
        >
          <ApperIcon name="Plus" size={14} className="text-primary-600" />
        </button>
      </div>
      
      <div className="space-y-1">
        {folders.map(folder => renderFolder(folder))}
      </div>
    </div>
  )
}

export default FolderTree