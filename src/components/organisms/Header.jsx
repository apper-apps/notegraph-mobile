import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import { AuthContext } from '../../App'

const Header = ({ onMenuToggle, onCreateNote, onCreateTask, title = "Dashboard" }) => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">{title}</h1>
            <p className="text-sm text-gray-500">Organize your thoughts and tasks</p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <SearchBar 
            placeholder="Search notes, tasks, and tags..."
            onSearch={(term) => console.log('Search:', term)}
            onFilter={(filters) => console.log('Filter:', filters)}
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            icon="Plus"
            onClick={onCreateNote}
            className="hidden sm:flex"
          >
            Note
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            icon="CheckSquare"
            onClick={onCreateTask}
            className="hidden sm:flex"
          >
            Task
          </Button>

<div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150 relative"
            >
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
            >
              <ApperIcon name="Settings" size={20} className="text-gray-600" />
            </motion.button>

            {user && (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName?.[0] || user.emailAddress?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.firstName || user.emailAddress}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ApperIcon name="LogOut" size={16} className="mr-1" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden mt-4">
        <SearchBar 
          placeholder="Search notes, tasks, and tags..."
          onSearch={(term) => console.log('Search:', term)}
          onFilter={(filters) => console.log('Filter:', filters)}
        />
      </div>
    </header>
  )
}

export default Header