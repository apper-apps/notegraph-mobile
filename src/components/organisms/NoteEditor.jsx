import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Tag from "@/components/atoms/Tag";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const NoteEditor = ({ 
  note, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  folders = []
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note',
    date: '',
    tags: [],
    folderId: '',
    completed: false
  })
  const [currentTag, setCurrentTag] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        type: note.type || 'note',
        date: note.date ? format(new Date(note.date), 'yyyy-MM-dd') : '',
        tags: note.tags || [],
        folderId: note.folderId || '',
        completed: note.completed || false
      })
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'note',
        date: '',
        tags: [],
        folderId: '',
        completed: false
      })
    }
  }, [note])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    setSaving(true)
    try {
      const noteData = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        updatedAt: new Date().toISOString()
      }

      if (note) {
        noteData.Id = note.Id
      } else {
        noteData.createdAt = new Date().toISOString()
      }

      await onSave(noteData)
      onClose()
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }))
      }
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleDelete = async () => {
    if (note && window.confirm('Are you sure you want to delete this item?')) {
      await onDelete(note.Id)
      onClose()
    }
  }

if (!isOpen) return null

  return (
    <AnimatePresence>
    <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        exit={{
            opacity: 0
        }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}>
        <motion.div
            initial={{
                x: "100%"
            }}
            animate={{
                x: 0
            }}
            exit={{
                x: "100%"
            }}
            transition={{
                type: "spring",
                damping: 25,
                stiffness: 300
            }}
            onClick={e => e.stopPropagation()}
            className="absolute right-0 top-0 h-full bg-white shadow-2xl w-full max-w-lg lg:max-w-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <ApperIcon
                        name={formData.type === "task" ? "CheckSquare" : "FileText"}
                        className="text-primary-600"
                        size={24} />
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 font-display">
                        {note ? `Edit ${formData.type}` : `Create ${formData.type}`}
                    </h2>
                </div>
                <div className="flex items-center space-x-2">
                    {note && <Button
                        variant="ghost"
                        size="sm"
                        icon="Trash2"
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700">Delete
                                        </Button>}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                        <ApperIcon name="X" size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col h-full flex-1">
                <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div className="grid grid-cols-1 gap-4 sm:gap-6">
                            <div>
                                <Input
                                    label="Title"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    placeholder={`Enter ${formData.type} title...`}
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-display mb-2">Type
                                                      </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="note"
                                            checked={formData.type === "note"}
                                            onChange={e => setFormData(prev => ({
                                                ...prev,
                                                type: e.target.value
                                            }))}
                                            className="text-primary-600 focus:ring-primary-500" />
                                        <span className="text-sm">Note</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            value="task"
                                            checked={formData.type === "task"}
                                            onChange={e => setFormData(prev => ({
                                                ...prev,
                                                type: e.target.value
                                            }))}
                                            className="text-primary-600 focus:ring-primary-500" />
                                        <span className="text-sm">Task</span>
                                    </label>
                                </div>
                            </div>
                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    date: e.target.value
                                }))} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 font-display mb-2">Folder
                                                      </label>
                                <select
                                    value={formData.folderId}
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        folderId: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                                    <option value="">No folder</option>
                                    <option value="personal">Personal</option>
                                    <option value="work">Work</option>
                                    <option value="projects">Projects</option>
                                    <option value="archive">Archive</option>
                                </select>
                            </div>
                            {formData.type === "task" && <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.completed}
                                    onChange={e => setFormData(prev => ({
                                        ...prev,
                                        completed: e.target.checked
                                    }))}
                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                                <label className="text-sm font-medium text-gray-700">Mark as completed</label>
                            </div>}
                        </div>
                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-display mb-2">Tags
                                                </label>
                            <Input
                                placeholder="Type a tag and press Enter..."
                                value={currentTag}
                                onChange={e => setCurrentTag(e.target.value)}
                                onKeyDown={handleAddTag} />
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags.map((tag, index) => <Tag
                                    key={index}
                                    removable
                                    onRemove={() => handleRemoveTag(tag)}
                                    color={["primary", "accent", "green", "blue", "purple", "pink"][index % 6]}>
                                    {tag}
                                </Tag>)}
                            </div>
                        </div>
                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 font-display mb-2">Content
                                                </label>
                            <textarea
                                value={formData.content}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    content: e.target.value
                                }))}
                                placeholder="Write your content here..."
                                rows={12}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none markdown-editor" />
                            <p className="text-xs text-gray-500 mt-2">Supports basic markdown formatting
                                                </p>
                        </div>
                    </div>
                    {/* Footer - Sticky at bottom */}
                    <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                        {note && <div className="text-xs text-gray-500 mb-3">Last updated: {format(new Date(note.updatedAt), "PPp")}
                        </div>}
                        <div className="flex flex-col space-y-3">
                            <Button
                                type="submit"
                                loading={saving}
                                disabled={!formData.title.trim()}
                                className="w-full">
                                {note ? "Update" : "Create"}
                            </Button>
                            <Button type="button" variant="ghost" onClick={onClose} className="w-full">Cancel
                                                </Button>
                        </div>
                    </div>
                </div></form>
        </motion.div>
    </motion.div>
</AnimatePresence>
  )
}

export default NoteEditor