import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import NoteCard from '@/components/molecules/NoteCard'
import NoteEditor from '@/components/organisms/NoteEditor'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Tag from '@/components/atoms/Tag'
import { noteService } from '@/services/api/noteService'
import { toast } from 'react-toastify'

const SearchPage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [searchHistory, setSearchHistory] = useState([])
  const [popularTags, setPopularTags] = useState([])

  useEffect(() => {
    loadNotes()
    loadSearchHistory()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      updateSearchHistory(searchTerm)
    }
  }, [searchTerm])

  const loadNotes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await noteService.getAll()
      setNotes(data)
      
      // Calculate popular tags
      const tagCounts = {}
      data.forEach(note => {
        (note.tags || []).forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      })
      
      const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }))
      
      setPopularTags(sortedTags)
    } catch (err) {
      setError('Failed to load notes. Please try again.')
      console.error('Error loading notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    setSearchHistory(history.slice(0, 5))
  }

  const updateSearchHistory = (term) => {
    if (term.length < 2) return
    
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 10)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
    setSearchHistory(newHistory.slice(0, 5))
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await noteService.update(editingNote.Id, noteData)
        toast.success(`${noteData.type === 'task' ? 'Task' : 'Note'} updated successfully!`)
      } else {
        await noteService.create(noteData)
        toast.success(`${noteData.type === 'task' ? 'Task' : 'Note'} created successfully!`)
      }
      await loadNotes()
      setIsEditorOpen(false)
    } catch (error) {
      toast.error('Failed to save item. Please try again.')
      console.error('Error saving note:', error)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await noteService.delete(noteId)
        toast.success('Item deleted successfully!')
        await loadNotes()
      } catch (error) {
        toast.error('Failed to delete item. Please try again.')
        console.error('Error deleting note:', error)
      }
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = notes.find(t => t.Id === taskId)
      const updatedTask = { ...task, completed: !task.completed }
      await noteService.update(taskId, updatedTask)
      
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened!')
      await loadNotes()
    } catch (error) {
      toast.error('Failed to update task. Please try again.')
      console.error('Error toggling task:', error)
    }
  }

  const handleTagClick = (tag) => {
    setSearchTerm(tag)
  }

  const handleHistoryClick = (term) => {
    setSearchTerm(term)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setFilters({})
  }

  const filteredNotes = notes.filter(note => {
    if (!searchTerm && !Object.keys(filters).some(key => filters[key])) {
      return false // Don't show all notes when no search is active
    }

    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = !filters.type || note.type === filters.type
    const matchesFolder = !filters.folder || note.folderId === filters.folder
    const matchesDate = !filters.date || (note.date && note.date.includes(filters.date))

    return matchesSearch && matchesType && matchesFolder && matchesDate
  })

  if (loading) return <Loading type="notes" />
  if (error) return <Error message={error} onRetry={loadNotes} />

  return (
<div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 font-display">Search</h1>
        <p className="text-gray-600 text-lg">Find your notes and tasks quickly</p>
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search notes, tasks, tags, or content..."
        onSearch={setSearchTerm}
        onFilter={setFilters}
        filters={filters}
      />

      {/* Search Results or Empty State */}
      {searchTerm || Object.keys(filters).some(key => filters[key]) ? (
        <>
          {/* Search Results Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 font-display">
                Search Results
              </h2>
              <span className="text-sm text-gray-500">
                {filteredNotes.length} items found
              </span>
            </div>
            
            {(searchTerm || Object.keys(filters).some(key => filters[key])) && (
              <button
                onClick={clearSearch}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-1"
              >
                <ApperIcon name="X" size={14} />
                <span>Clear search</span>
              </button>
            )}
          </div>

          {/* Results */}
          {filteredNotes.length === 0 ? (
            <Empty
              type="search"
              onAction={clearSearch}
            />
          ) : (
<motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NoteCard
                    note={note}
                    onClick={() => handleEditNote(note)}
                    onEdit={() => handleEditNote(note)}
                    onDelete={() => handleDeleteNote(note.Id)}
                    onToggleComplete={handleToggleComplete}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      ) : (
        /* Search Discovery */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search History */}
<div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-soft hover:shadow-medium transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center space-x-3">
              <div className="bg-primary-100 rounded-xl p-2">
                <ApperIcon name="Clock" size={20} className="text-primary-600" />
              </div>
              <span>Recent Searches</span>
            </h3>

            {searchHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="bg-gray-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name="Search" size={32} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium">No recent searches</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchHistory.map((term, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHistoryClick(term)}
                    className="flex items-center space-x-4 w-full p-3 hover:bg-gray-50 rounded-xl text-left transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="bg-gray-100 rounded-lg p-2">
                      <ApperIcon name="Clock" size={16} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{term}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Tags */}
<div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-soft hover:shadow-medium transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center space-x-3">
              <div className="bg-accent-100 rounded-xl p-2">
                <ApperIcon name="Tag" size={20} className="text-accent-600" />
              </div>
              <span>Popular Tags</span>
            </h3>

            {popularTags.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="bg-gray-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ApperIcon name="Tag" size={32} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium">No tags found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {popularTags.map(({ tag, count }, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Tag
                      color={['primary', 'accent', 'green', 'blue', 'purple', 'pink'][index % 6]}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Tag>
                    <span className="text-sm text-gray-500 font-medium">{count} items</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Stats */}
      {notes.length > 0 && (
<div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-soft">
          <h3 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center space-x-3">
            <div className="bg-green-100 rounded-xl p-2">
              <ApperIcon name="BarChart3" size={20} className="text-green-600" />
            </div>
            <span>Search Statistics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <p className="text-3xl font-bold text-primary-600 mb-1">{notes.length}</p>
              <p className="text-sm text-gray-600 font-medium">Total Items</p>
            </div>
            
            <div className="text-center p-4 bg-accent-50 rounded-xl">
              <p className="text-3xl font-bold text-accent-600 mb-1">
                {notes.filter(n => n.type === 'note').length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Notes</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-3xl font-bold text-green-600 mb-1">
                {notes.filter(n => n.type === 'task').length}
              </p>
              <p className="text-sm text-gray-600 font-medium">Tasks</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-3xl font-bold text-purple-600 mb-1">
                {new Set(notes.flatMap(note => note.tags || [])).size}
              </p>
              <p className="text-sm text-gray-600 font-medium">Unique Tags</p>
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      <NoteEditor
        note={editingNote}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  )
}

export default SearchPage