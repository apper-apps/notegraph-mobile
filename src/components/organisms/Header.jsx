import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import { AuthContext } from '../../App'

const Header = ({ onMenuToggle, title = "Dashboard" }) => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)

  return (
<header className="bg-white border-b border-gray-200 px-6 py-5">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">{title}</h1>
            <p className="text-sm text-gray-500 font-medium">Organize your thoughts and tasks</p>
          </div>
        </div>

        {/* Right Section */}
<div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative"
            >
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"></div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <ApperIcon name="Settings" size={20} className="text-gray-600" />
            </motion.button>
{user && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-semibold">
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
</header>
  )
}

export default Header