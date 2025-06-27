import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import NoteCard from '@/components/molecules/NoteCard'

const CalendarView = ({ notes, onEditNote, onDeleteNote }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1))
  }
  
  const getNotesForDate = (date) => {
    return notes.filter(note => 
      note.date && isSameDay(new Date(note.date), date)
    )
  }
  
  const notesWithoutDates = notes.filter(note => !note.date)
  
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ChevronRight" size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {daysInMonth.map(day => {
            const dayNotes = getNotesForDate(day)
            const isCurrentDay = isToday(day)
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-32 p-2 border-r border-b border-gray-100 ${
                  isCurrentDay ? 'bg-primary-50' : 'bg-white hover:bg-gray-50'
                } transition-colors`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  isCurrentDay ? 'text-primary-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayNotes.map(note => (
                    <motion.div
                      key={note.Id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="transform hover:scale-105 transition-transform"
                    >
                      <div
                        onClick={() => onEditNote(note)}
                        className="p-2 bg-primary-100 hover:bg-primary-200 rounded text-xs cursor-pointer transition-colors"
                      >
                        <div className="font-medium text-primary-800 truncate">
                          {note.title || 'Untitled'}
                        </div>
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {note.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="px-1 py-0.5 bg-primary-200 text-primary-700 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {note.tags.length > 2 && (
                              <span className="text-primary-600">+{note.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Unscheduled Notes */}
      {notesWithoutDates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <ApperIcon name="Clock" size={20} className="text-gray-600" />
            <span>Unscheduled Notes</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notesWithoutDates.map(note => (
              <motion.div
                key={note.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <NoteCard
                  note={note}
                  onClick={() => onEditNote(note)}
                  onEdit={() => onEditNote(note)}
                  onDelete={() => onDeleteNote(note.Id)}
                  viewMode="grid"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView