import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { noteService } from "@/services/api/noteService";
import ApperIcon from "@/components/ApperIcon";
import NoteCard from "@/components/molecules/NoteCard";
import NoteEditor from "@/components/organisms/NoteEditor";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";

const NotesPage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [sortBy, setSortBy] = useState('updated')
  
  const { currentView, selectedFolder, selectedTags } = useSelector((state) => state.view)
  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await noteService.getAll()
      setNotes(data.filter(item => item.type === 'note'))
    } catch (err) {
      setError('Failed to load notes. Please try again.')
      console.error('Error loading notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setIsEditorOpen(true)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await noteService.update(editingNote.Id, noteData)
        toast.success('Note updated successfully!')
      } else {
        await noteService.create(noteData)
        toast.success('Note created successfully!')
      }
      await loadNotes()
      setIsEditorOpen(false)
    } catch (error) {
      toast.error('Failed to save note. Please try again.')
      console.error('Error saving note:', error)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.delete(noteId)
        toast.success('Note deleted successfully!')
        await loadNotes()
      } catch (error) {
        toast.error('Failed to delete note. Please try again.')
        console.error('Error deleting note:', error)
      }
    }
  }

const filteredNotes = notes.filter(note => {
    const matchesFolder = !selectedFolder || note.folder_id === selectedFolder
    const matchesTags = selectedTags.length === 0 || 
      (note.tags && Array.isArray(note.tags) && 
       selectedTags.some(selectedTag => note.tags.includes(selectedTag)))

    return matchesFolder && matchesTags
  })

const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'created':
        return new Date(b.created_at) - new Date(a.created_at)
case 'updated':
      default:
        return new Date(b.updated_at) - new Date(a.updated_at)
    }
  })

  if (loading) return <Loading type="notes" />
  if (error) return <Error message={error} onRetry={loadNotes} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 font-display">Notes</h1>
          <p className="text-gray-600">Capture and organize your thoughts</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="title">Title</option>
          </select>

          <Button
            onClick={handleCreateNote}
            icon="Plus"
            className="flex items-center space-x-2"
          >
            Create Note
          </Button>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Notes</p>
              <p className="text-2xl font-bold">{notes.length}</p>
            </div>
            <ApperIcon name="FileText" size={24} className="text-primary-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">Tagged Notes</p>
              <p className="text-2xl font-bold">
                {notes.filter(note => note.tags && note.tags.length > 0).length}
              </p>
            </div>
            <ApperIcon name="Tag" size={24} className="text-accent-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">With Dates</p>
              <p className="text-2xl font-bold">
                {notes.filter(note => note.date).length}
              </p>
            </div>
            <ApperIcon name="Calendar" size={24} className="text-green-200" />
          </div>
        </motion.div>
      </div>
{/* Notes Display */}
      {sortedNotes.length === 0 ? (
        <Empty
          type="notes"
          onAction={handleCreateNote}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${
            currentView === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}
        >
          {sortedNotes.map((note, index) => (
            <motion.div
              key={note.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={currentView === 'list' ? 'w-full' : ''}
            >
              <NoteCard
                note={note}
                onClick={() => handleEditNote(note)}
                onEdit={() => handleEditNote(note)}
                onDelete={() => handleDeleteNote(note.Id)}
                viewMode={currentView}
              />
            </motion.div>
          ))}
        </motion.div>
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

export default NotesPage