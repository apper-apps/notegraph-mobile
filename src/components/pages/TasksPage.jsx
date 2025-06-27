import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import NoteCard from '@/components/molecules/NoteCard'
import NoteEditor from '@/components/organisms/NoteEditor'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { noteService } from '@/services/api/noteService'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [sortBy, setSortBy] = useState('updated')
  const [showCompleted, setShowCompleted] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await noteService.getAll()
      setTasks(data.filter(item => item.type === 'task'))
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsEditorOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsEditorOpen(true)
  }

  const handleSaveTask = async (taskData) => {
    try {
      const dataWithType = { ...taskData, type: 'task' }
      
      if (editingTask) {
        await noteService.update(editingTask.Id, dataWithType)
        toast.success('Task updated successfully!')
      } else {
        await noteService.create(dataWithType)
        toast.success('Task created successfully!')
      }
      await loadTasks()
      setIsEditorOpen(false)
    } catch (error) {
      toast.error('Failed to save task. Please try again.')
      console.error('Error saving task:', error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await noteService.delete(taskId)
        toast.success('Task deleted successfully!')
        await loadTasks()
      } catch (error) {
        toast.error('Failed to delete task. Please try again.')
        console.error('Error deleting task:', error)
      }
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      const updatedTask = { ...task, completed: !task.completed }
      await noteService.update(taskId, updatedTask)
      
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened!')
      await loadTasks()
    } catch (error) {
      toast.error('Failed to update task. Please try again.')
      console.error('Error toggling task:', error)
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFolder = !filters.folder || task.folderId === filters.folder
    const matchesDate = !filters.date || (task.date && task.date.includes(filters.date))
    const matchesCompletion = showCompleted || !task.completed

    return matchesSearch && matchesFolder && matchesDate && matchesCompletion
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'due':
        if (!a.date && !b.date) return 0
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(a.date) - new Date(b.date)
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'updated':
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt)
    }
  })

  const completedTasks = tasks.filter(task => task.completed)
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.date && new Date(task.date) < new Date()
  )

  if (loading) return <Loading type="notes" />
  if (error) return <Error message={error} onRetry={loadTasks} />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 font-display">Tasks</h1>
          <p className="text-gray-600">Stay organized and get things done</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="due">Due Date</option>
            <option value="title">Title</option>
          </select>

          <Button
            onClick={handleCreateTask}
            icon="Plus"
            className="flex items-center space-x-2"
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          placeholder="Search tasks by title, content, or tags..."
          onSearch={setSearchTerm}
          onFilter={setFilters}
          filters={filters}
        />

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Show completed tasks</span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold">{tasks.length}</p>
            </div>
            <ApperIcon name="CheckSquare" size={24} className="text-primary-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-2xl font-bold">{completedTasks.length}</p>
            </div>
            <ApperIcon name="CheckCircle" size={24} className="text-green-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Overdue</p>
              <p className="text-2xl font-bold">{overdueTasks.length}</p>
            </div>
            <ApperIcon name="AlertCircle" size={24} className="text-red-200" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm">In Progress</p>
              <p className="text-2xl font-bold">{tasks.length - completedTasks.length}</p>
            </div>
            <ApperIcon name="Clock" size={24} className="text-accent-200" />
          </div>
        </motion.div>
      </div>

      {/* Tasks Grid */}
      {sortedTasks.length === 0 ? (
        <Empty
          type="tasks"
          onAction={handleCreateTask}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NoteCard
                note={task}
                onClick={() => handleEditTask(task)}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task.Id)}
                onToggleComplete={handleToggleComplete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Task Editor Modal */}
      <NoteEditor
        note={editingTask}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  )
}

export default TasksPage