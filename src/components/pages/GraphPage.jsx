import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import GraphVisualization from '@/components/organisms/GraphVisualization'
import NoteEditor from '@/components/organisms/NoteEditor'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import SearchBar from '@/components/molecules/SearchBar'
import { noteService } from '@/services/api/noteService'

const GraphPage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
const [editingNote, setEditingNote] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [filterType, setFilterType] = useState('all') // all, notes, tasks
  const [selectedTags, setSelectedTags] = useState([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedFolder, setSelectedFolder] = useState('')
  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await noteService.getAll()
      setNotes(data)
    } catch (err) {
      setError('Failed to load graph data. Please try again.')
      console.error('Error loading notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNodeClick = (note) => {
    setSelectedNode(note)
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setIsEditorOpen(true)
  }

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote?.Id) {
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

  const handleFilterChange = (filters) => {
    setSelectedTags(filters.tags || [])
    setDateRange(filters.dateRange || { start: '', end: '' })
    setSelectedFolder(filters.folder || '')
  }
  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await noteService.delete(noteId)
        toast.success('Item deleted successfully!')
        await loadNotes()
        setIsEditorOpen(false)
      } catch (error) {
        toast.error('Failed to delete item. Please try again.')
        console.error('Error deleting note:', error)
      }
    }
  }

const filteredNotes = notes.filter(note => {
    // Type filter
    if (filterType === 'notes' && note.type !== 'note') return false
    if (filterType === 'tasks' && note.type !== 'task') return false
    
    // Tag filter - note must have ALL selected tags
    if (selectedTags.length > 0) {
      const noteTags = note.tags || []
      const hasAllTags = selectedTags.every(tag => noteTags.includes(tag))
      if (!hasAllTags) return false
    }
    
    // Date range filter
    if (dateRange.start || dateRange.end) {
      const noteDate = new Date(note.createdAt)
      if (dateRange.start && noteDate < new Date(dateRange.start)) return false
      if (dateRange.end && noteDate > new Date(dateRange.end)) return false
    }
    
    // Folder filter
    if (selectedFolder && note.folder !== selectedFolder) return false
    
    return true
  })

  const getConnectionStats = () => {
    const connections = []
    const tagConnections = new Map()

    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const noteA = notes[i]
        const noteB = notes[j]
        const sharedTags = (noteA.tags || []).filter(tag => (noteB.tags || []).includes(tag))
        
        if (sharedTags.length > 0) {
          connections.push({ from: noteA.Id, to: noteB.Id, tags: sharedTags })
          
          sharedTags.forEach(tag => {
            tagConnections.set(tag, (tagConnections.get(tag) || 0) + 1)
          })
        }
      }
    }

    const mostConnectedTag = [...tagConnections.entries()]
      .sort((a, b) => b[1] - a[1])[0]

    return {
      totalConnections: connections.length,
      mostConnectedTag: mostConnectedTag ? mostConnectedTag[0] : null,
      tagConnectionCount: mostConnectedTag ? mostConnectedTag[1] : 0
    }
  }

  const stats = getConnectionStats()

  if (loading) return <Loading type="graph" />
  if (error) return <Error message={error} onRetry={loadNotes} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 font-display">Knowledge Graph</h1>
          <p className="text-gray-600">Visualize connections between your notes and tasks</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Items</option>
            <option value="notes">Notes Only</option>
            <option value="tasks">Tasks Only</option>
          </select>

          <Button
            onClick={handleCreateNote}
            icon="Plus"
            className="flex items-center space-x-2"
          >
            Add Node
</Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <SearchBar
        placeholder="Search and filter graph nodes..."
        onSearch={() => {}} // Search not implemented for graph view
        onFilter={handleFilterChange}
        filters={{
          tags: selectedTags,
          dateRange: dateRange,
          folder: selectedFolder
        }}
        className="mb-4"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Nodes</p>
              <p className="text-2xl font-bold">{filteredNotes.length}</p>
            </div>
            <ApperIcon name="Network" size={24} className="text-primary-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Connections</p>
              <p className="text-2xl font-bold">{stats.totalConnections}</p>
            </div>
            <ApperIcon name="GitBranch" size={24} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">Tagged Items</p>
              <p className="text-2xl font-bold">
                {notes.filter(note => note.tags && note.tags.length > 0).length}
              </p>
            </div>
            <ApperIcon name="Tag" size={24} className="text-accent-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Top Tag</p>
              <p className="text-sm font-bold truncate">
                {stats.mostConnectedTag || 'None'}
              </p>
            </div>
            <ApperIcon name="Star" size={24} className="text-purple-200" />
          </div>
        </motion.div>
      </div>

      {/* Graph Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredNotes.length === 0 ? (
          <Empty
            type="graph"
            onAction={handleCreateNote}
          />
        ) : (
          <div className="h-[600px]">
            <GraphVisualization
              notes={filteredNotes}
              onNodeClick={handleNodeClick}
              className="h-full"
            />
          </div>
        )}
      </div>

      {/* Graph Insights */}
      {notes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-4 flex items-center space-x-2">
              <ApperIcon name="TrendingUp" size={20} className="text-primary-600" />
              <span>Connection Insights</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Most connected items</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.max(...notes.map(note => (note.tags || []).length))} tags
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Average connections per item</span>
                <span className="text-sm font-medium text-gray-900">
                  {notes.length > 0 ? (stats.totalConnections * 2 / notes.length).toFixed(1) : 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Unique tags</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Set(notes.flatMap(note => note.tags || [])).size}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Isolated items</span>
                <span className="text-sm font-medium text-gray-900">
                  {notes.filter(note => !note.tags || note.tags.length === 0).length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-4 flex items-center space-x-2">
              <ApperIcon name="Tag" size={20} className="text-accent-600" />
              <span>Popular Tags</span>
            </h3>

            <div className="space-y-3">
              {[...new Set(notes.flatMap(note => note.tags || []))]
                .map(tag => ({
                  tag,
                  count: notes.filter(note => (note.tags || []).includes(tag)).length
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map(({ tag, count }) => (
                  <div key={tag} className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {tag}
                    </span>
                    <span className="text-sm text-gray-500">{count} items</span>
                  </div>
                ))}
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

export default GraphPage