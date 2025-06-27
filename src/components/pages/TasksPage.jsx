import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NoteEditor from "@/components/organisms/NoteEditor";
import Button from "@/components/atoms/Button";
import NoteCard from "@/components/molecules/NoteCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { noteService } from "@/services/api/noteService";

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [sortBy, setSortBy] = useState('updated')
  const [showCompleted, setShowCompleted] = useState(true)
  
  const { currentView, selectedFolder, selectedTags } = useSelector((state) => state.view)
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
    const matchesFolder = !selectedFolder || task.folder_id === selectedFolder
    const matchesTags = selectedTags.length === 0 || 
      (task.tags && Array.isArray(task.tags) && 
       selectedTags.some(selectedTag => task.tags.includes(selectedTag)))
    const matchesCompletion = showCompleted || !task.completed

    return matchesFolder && matchesTags && matchesCompletion
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
        return new Date(b.created_at) - new Date(a.created_at)
      case 'updated':
      default:
        return new Date(b.updated_at) - new Date(a.updated_at)
    }
  })

  const completedTasks = tasks.filter(task => task.completed)
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.date && new Date(task.date) < new Date()
  )

  if (loading) return <Loading type="notes" />
  if (error) return <Error message={error} onRetry={loadTasks} />

  return (
<div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 font-display">Tasks</h1>
          <p className="text-gray-600 text-lg">Stay organized and get things done</p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <option value="updated">Last Updated</option>
            <option value="created">Date Created</option>
            <option value="due">Due Date</option>
            <option value="title">Title</option>
          </select>

          <Button
            onClick={handleCreateTask}
            icon="Plus"
            className="flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            Create Task
          </Button>
        </div>
      </div>

{/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-md"
          />
          <span className="text-gray-700 font-medium">Show completed tasks</span>
        </label>
      </div>

{/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-medium transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold mt-1">{tasks.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <ApperIcon name="CheckSquare" size={28} className="text-white" />
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
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-1">{completedTasks.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <ApperIcon name="CheckCircle" size={28} className="text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-soft hover:shadow-medium transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold mt-1">{overdueTasks.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <ApperIcon name="AlertCircle" size={28} className="text-white" />
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
              <p className="text-accent-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-1">{tasks.length - completedTasks.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-3">
              <ApperIcon name="Clock" size={28} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

{/* Tasks Display */}
      {sortedTasks.length === 0 ? (
        <Empty
          type="tasks"
          onAction={handleCreateTask}
        />
      ) : (
<motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${
            currentView === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }`}
        >
          {sortedTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={currentView === 'list' ? 'w-full' : ''}
            >
              <NoteCard
                note={task}
                onClick={() => handleEditTask(task)}
                onEdit={() => handleEditTask(task)}
                onDelete={() => handleDeleteTask(task.Id)}
                onToggleComplete={handleToggleComplete}
                viewMode={currentView}
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