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
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 font-display">Search</h1>
        <p className="text-gray-600">Find your notes and tasks quickly</p>
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-4 flex items-center space-x-2">
              <ApperIcon name="Clock" size={20} className="text-primary-600" />
              <span>Recent Searches</span>
            </h3>

            {searchHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Search" size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No recent searches</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchHistory.map((term, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 4 }}
                    onClick={() => handleHistoryClick(term)}
                    className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg text-left transition-colors duration-150"
                  >
                    <ApperIcon name="Clock" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">{term}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-4 flex items-center space-x-2">
              <ApperIcon name="Tag" size={20} className="text-accent-600" />
              <span>Popular Tags</span>
            </h3>

            {popularTags.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Tag" size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No tags found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {popularTags.map(({ tag, count }, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <Tag
                      color={['primary', 'accent', 'green', 'blue', 'purple', 'pink'][index % 6]}
                      className="cursor-pointer"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Tag>
                    <span className="text-sm text-gray-500">{count} items</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Stats */}
      {notes.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 font-display mb-4 flex items-center space-x-2">
            <ApperIcon name="BarChart3" size={20} className="text-green-600" />
            <span>Search Statistics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{notes.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-accent-600">
                {notes.filter(n => n.type === 'note').length}
              </p>
              <p className="text-sm text-gray-600">Notes</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {notes.filter(n => n.type === 'task').length}
              </p>
              <p className="text-sm text-gray-600">Tasks</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {new Set(notes.flatMap(note => note.tags || [])).size}
              </p>
              <p className="text-sm text-gray-600">Unique Tags</p>
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