import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  type = 'default', 
  title = "Nothing here yet", 
  description = "Get started by creating your first item",
  actionText = "Create New",
  onAction,
  icon = "Plus"
}) => {
  const getEmptyState = () => {
    switch (type) {
      case 'notes':
        return {
          title: "No notes yet",
          description: "Start capturing your thoughts and ideas. Create your first note to get organized.",
          actionText: "Create Note",
          icon: "FileText"
        }
      case 'tasks':
        return {
          title: "No tasks yet",
          description: "Stay productive by tracking your to-dos. Add your first task to get started.",
          actionText: "Add Task",
          icon: "CheckSquare"
        }
      case 'calendar':
        return {
          title: "No events today",
          description: "Your calendar is clear. Add notes or tasks with dates to see them here.",
          actionText: "Add Event",
          icon: "Calendar"
        }
      case 'graph':
        return {
          title: "No connections yet",
          description: "Create notes and tasks with shared tags to see connections in the graph view.",
          actionText: "Create Note",
          icon: "Network"
        }
      case 'search':
        return {
          title: "No results found",
          description: "Try adjusting your search terms or filters to find what you're looking for.",
          actionText: "Clear Search",
          icon: "Search"
        }
      default:
        return { title, description, actionText, icon }
    }
  }

  const emptyState = getEmptyState()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-lg border border-primary-100 p-12 text-center"
    >
      <div className="flex flex-col items-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <ApperIcon name={emptyState.icon} className="w-10 h-10 text-white" />
        </motion.div>
        
        <div className="space-y-3 max-w-md">
          <h3 className="text-xl font-semibold text-gray-900 font-display">
            {emptyState.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {emptyState.description}
          </p>
        </div>

        {onAction && (
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl font-medium"
          >
            <ApperIcon name={emptyState.icon} size={18} />
            <span>{emptyState.actionText}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty