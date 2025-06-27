import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import FolderTree from '@/components/molecules/FolderTree'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import { setCurrentView, setSelectedFolder, toggleTag, clearFilters } from '@/store/viewSlice'
import { noteService } from '@/services/api/noteService'

const Sidebar = ({ isOpen, onClose, onCreateNote, onCreateTask }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { currentView, selectedFolder, selectedTags } = useSelector((state) => state.view)
  const [allNotes, setAllNotes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const navigationItems = [
    { to: '/notes', icon: 'FileText', label: 'Notes' },
    { to: '/tasks', icon: 'CheckSquare', label: 'Tasks' },
    { to: '/calendar', icon: 'Calendar', label: 'Calendar' },
    { to: '/graph', icon: 'Network', label: 'Graph' },
    { to: '/search', icon: 'Search', label: 'Search' }
  ]

  const viewOptions = [
    { value: 'grid', icon: 'Grid3X3', label: 'Grid' },
    { value: 'list', icon: 'List', label: 'List' },
    { value: 'calendar', icon: 'Calendar', label: 'Calendar' }
  ]
useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await noteService.getAll()
        setAllNotes(data)
      } catch (error) {
        console.error('Error loading notes for sidebar:', error)
      }
    }
    loadNotes()
  }, [])

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

  // Extract unique tags from all notes
  const allTags = [...new Set(
    allNotes
      .filter(note => note.tags && Array.isArray(note.tags))
      .flatMap(note => note.tags)
      .filter(tag => tag && tag.trim())
  )].sort()

  const handleViewChange = (view) => {
    dispatch(setCurrentView(view))
  }

  const handleFolderSelect = (folderId) => {
    dispatch(setSelectedFolder(folderId === selectedFolder ? null : folderId))
  }

  const handleTagToggle = (tag) => {
    dispatch(toggleTag(tag))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
    setSearchTerm('')
  }

  const currentPage = location.pathname.slice(1) || 'notes'
  const showViewOptions = ['notes', 'tasks'].includes(currentPage)
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
          <nav className="px-4 py-6 space-y-2">
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

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <SearchBar 
              placeholder="Search notes and tasks..."
              onSearch={setSearchTerm}
              value={searchTerm}
            />
          </div>

          {/* View Options */}
          {showViewOptions && (
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-gray-700 font-display mb-3">View Options</h3>
              <div className="grid grid-cols-3 gap-1">
                {viewOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleViewChange(option.value)}
                    className={`p-2 rounded-lg transition-all duration-150 text-xs flex flex-col items-center space-y-1 ${
                      currentView === option.value
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ApperIcon name={option.icon} size={16} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-4 pb-4">
            <h3 className="text-sm font-semibold text-gray-700 font-display mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                icon="FileText"
                onClick={onCreateNote}
                className="w-full justify-start text-left"
              >
                Create Note
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="CheckSquare"
                onClick={onCreateTask}
                className="w-full justify-start text-left"
              >
                Create Task
              </Button>
            </div>
          </div>
{/* Folders Section */}
          <div className="px-4 pb-4 border-t border-gray-200 pt-4">
            <FolderTree 
              folders={folders}
              selectedFolder={selectedFolder}
              onFolderSelect={handleFolderSelect}
              onFolderCreate={() => console.log('Create folder')}
              onFolderEdit={(id, name) => console.log('Edit folder:', id, name)}
              onFolderDelete={(id) => console.log('Delete folder:', id)}
            />
          </div>

          {/* Tags Section */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 font-display">Tags</h3>
              {selectedTags.length > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="max-h-32 overflow-y-auto">
              {allTags.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No tags found</p>
              ) : (
                <div className="space-y-1">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`block w-full text-left px-2 py-1 text-xs rounded transition-colors duration-150 ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="inline-flex items-center space-x-1">
                        <ApperIcon 
                          name="Tag" 
                          size={10} 
                          className={selectedTags.includes(tag) ? 'text-primary-600' : 'text-gray-400'} 
                        />
                        <span>{tag}</span>
                        {selectedTags.includes(tag) && (
                          <ApperIcon name="Check" size={10} className="text-primary-600" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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