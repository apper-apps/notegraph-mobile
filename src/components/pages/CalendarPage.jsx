import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import CalendarView from '@/components/organisms/CalendarView'
import NoteEditor from '@/components/organisms/NoteEditor'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { noteService } from '@/services/api/noteService'

const CalendarPage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  
  const { selectedFolder, selectedTags } = useSelector((state) => state.view)
useEffect(() => {
    loadNotes()
  }, [selectedFolder, selectedTags])
  const loadNotes = async () => {
    try {
      setLoading(true)
setError('')
      const data = await noteService.getAll()
      // Only show notes/tasks that have dates and match current filters
      const filteredData = data.filter(item => {
        const hasDate = item.date
        const matchesFolder = !selectedFolder || item.folder_id === selectedFolder
        const matchesTags = selectedTags.length === 0 || 
          (item.tags && Array.isArray(item.tags) && 
           selectedTags.some(selectedTag => item.tags.includes(selectedTag)))
        
        return hasDate && matchesFolder && matchesTags
      })
      setNotes(filteredData)
    } catch (err) {
      setError('Failed to load calendar data. Please try again.')
      console.error('Error loading notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setEditingNote({
      type: 'note',
      date: date.toISOString(),
      title: '',
      content: '',
      tags: [],
      folderId: '',
      completed: false
    })
    setIsEditorOpen(true)
  }

  const handleNoteClick = (note) => {
    setEditingNote(note)
    setIsEditorOpen(true)
  }

  const handleCreateEvent = () => {
    setEditingNote({
      type: 'note',
      date: new Date().toISOString(),
      title: '',
      content: '',
      tags: [],
      folderId: '',
      completed: false
    })
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

  const upcomingEvents = notes
    .filter(note => new Date(note.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  if (loading) return <Loading type="calendar" />
  if (error) return <Error message={error} onRetry={loadNotes} />

  return (
<div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 font-display">Calendar</h1>
          <p className="text-gray-600 text-lg">View your notes and tasks by date</p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={handleCreateEvent}
            icon="Plus"
            className="flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            Add Event
          </Button>
        </div>
      </div>

{/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-medium transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Events</p>
              <p className="text-3xl font-bold mt-1">{notes.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <ApperIcon name="Calendar" size={28} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-medium transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold mt-1">
                {notes.filter(note => {
                  const noteDate = new Date(note.date)
                  const now = new Date()
                  return noteDate.getMonth() === now.getMonth() && 
                         noteDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <ApperIcon name="TrendingUp" size={28} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-medium transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm font-medium">Upcoming</p>
              <p className="text-3xl font-bold mt-1">{upcomingEvents.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <ApperIcon name="Clock" size={28} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          {notes.length === 0 ? (
            <Empty
              type="calendar"
              onAction={handleCreateEvent}
            />
          ) : (
            <CalendarView
              notes={notes}
              onDateClick={handleDateClick}
              onNoteClick={handleNoteClick}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center space-x-3">
              <div className="bg-primary-100 rounded-xl p-2">
                <ApperIcon name="Clock" size={20} className="text-primary-600" />
              </div>
              <span>Upcoming Events</span>
            </h3>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <motion.div
                    key={event.Id}
                    whileHover={{ x: 4 }}
                    onClick={() => handleNoteClick(event)}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150 border border-gray-100"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        event.type === 'note' ? 'bg-primary-500' : 
                        (event.completed ? 'bg-green-500' : 'bg-accent-500')
                      }`}></div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-gray-900 text-sm line-clamp-1 ${
                          event.completed ? 'line-through text-gray-500' : ''
                        }`}>
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                        </p>
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {event.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-gray-900 font-display mb-6">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                icon="FileText"
                onClick={() => {
                  setEditingNote({
                    type: 'note',
                    date: new Date().toISOString(),
                    title: '',
                    content: '',
                    tags: [],
                    folderId: '',
                    completed: false
                  })
                  setIsEditorOpen(true)
                }}
                className="w-full justify-start"
              >
                Add Note
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                icon="CheckSquare"
                onClick={() => {
                  setEditingNote({
                    type: 'task',
                    date: new Date().toISOString(),
                    title: '',
                    content: '',
                    tags: [],
                    folderId: '',
                    completed: false
                  })
                  setIsEditorOpen(true)
                }}
                className="w-full justify-start"
              >
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </div>

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

export default CalendarPage