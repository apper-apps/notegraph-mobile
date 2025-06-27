import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import FolderTree from '@/components/molecules/FolderTree'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigationItems = [
    { to: '/notes', icon: 'FileText', label: 'Notes' },
    { to: '/tasks', icon: 'CheckSquare', label: 'Tasks' },
    { to: '/calendar', icon: 'Calendar', label: 'Calendar' },
    { to: '/graph', icon: 'Network', label: 'Graph' },
    { to: '/search', icon: 'Search', label: 'Search' }
  ]

  const folders = [
    { 
      id: 'personal', 
      name: 'Personal', 
      children: [
        { id: 'personal-journal', name: 'Journal' },
        { id: 'personal-ideas', name: 'Ideas' }
      ]
    },
    { 
      id: 'work', 
      name: 'Work', 
      children: [
        { id: 'work-projects', name: 'Projects' },
        { id: 'work-meetings', name: 'Meetings' }
      ]
    },
    { id: 'archive', name: 'Archive' }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-70 bg-white border-r border-gray-200 z-50 lg:relative lg:translate-x-0 lg:z-auto shadow-xl lg:shadow-none"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Network" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 font-display">NoteGraph</h1>
            </div>
            
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-150
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                  }
                `}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Folders Section */}
          <div className="px-4 py-4 border-t border-gray-200">
            <FolderTree 
              folders={folders}
              selectedFolder={null}
              onFolderSelect={(folderId) => console.log('Selected folder:', folderId)}
              onFolderCreate={() => console.log('Create folder')}
              onFolderEdit={(id, name) => console.log('Edit folder:', id, name)}
              onFolderDelete={(id) => console.log('Delete folder:', id)}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Visual Knowledge Management</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar