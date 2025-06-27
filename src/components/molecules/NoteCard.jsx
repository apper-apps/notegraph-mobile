import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Tag from '@/components/atoms/Tag'

const NoteCard = ({ 
  note, 
  onClick, 
  onEdit, 
  onDelete, 
  onToggleComplete,
  className = "" 
}) => {
  const handleCardClick = (e) => {
    e.stopPropagation()
    onClick?.(note)
  }

  const handleActionClick = (e, action) => {
    e.stopPropagation()
    action()
  }

  const tagColors = ['primary', 'accent', 'green', 'blue', 'purple', 'pink']
  
  return (
    <motion.div
      whileHover={{ y: -2, shadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:border-primary-300 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {note.type === 'task' && (
            <button
              onClick={(e) => handleActionClick(e, () => onToggleComplete?.(note.Id))}
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
                note.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-primary-500'
              }`}
            >
              {note.completed && <ApperIcon name="Check" size={12} />}
            </button>
          )}
          
          <ApperIcon 
            name={note.type === 'task' ? 'CheckSquare' : 'FileText'} 
            size={16} 
            className={note.type === 'task' ? 
              (note.completed ? 'text-green-500' : 'text-accent-500') : 
              'text-primary-500'
            } 
          />
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => handleActionClick(e, () => onEdit?.(note))}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-150"
          >
            <ApperIcon name="Edit2" size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
          <button
            onClick={(e) => handleActionClick(e, () => onDelete?.(note.Id))}
            className="p-1 hover:bg-red-100 rounded-full transition-colors duration-150"
          >
            <ApperIcon name="Trash2" size={14} className="text-gray-400 hover:text-red-600" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className={`font-semibold text-gray-900 font-display line-clamp-1 ${note.completed ? 'line-through text-gray-500' : ''}`}>
          {note.title}
        </h3>
        
        {note.content && (
          <p className={`text-gray-600 text-sm line-clamp-2 ${note.completed ? 'line-through' : ''}`}>
            {note.content}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {note.tags?.slice(0, 3).map((tag, index) => (
              <Tag 
                key={index} 
                color={tagColors[index % tagColors.length]} 
                size="xs"
              >
                {tag}
              </Tag>
            ))}
            {note.tags?.length > 3 && (
              <Tag color="gray" size="xs">
                +{note.tags.length - 3}
              </Tag>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {note.date && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" size={12} />
                <span>{format(new Date(note.date), 'MMM d')}</span>
              </div>
            )}
            {note.folderId && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Folder" size={12} />
                <span className="capitalize">{note.folderId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NoteCard