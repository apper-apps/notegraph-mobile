import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const CalendarView = ({ notes = [], onDateClick, onNoteClick, className = "" }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState('month') // month, week

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const getNotesForDate = (date) => {
    return notes.filter(note => 
      note.date && isSameDay(new Date(note.date), date)
    )
  }

  const getDayEvents = (date) => {
    const dayNotes = getNotesForDate(date)
    return {
      notes: dayNotes.filter(n => n.type === 'note'),
      tasks: dayNotes.filter(n => n.type === 'task'),
      completedTasks: dayNotes.filter(n => n.type === 'task' && n.completed)
    }
  }

  const renderCalendarDay = (date) => {
    const events = getDayEvents(date)
    const totalEvents = events.notes.length + events.tasks.length
    const isCurrentMonth = isSameMonth(date, currentDate)
    const isCurrentDay = isToday(date)

    return (
      <motion.div
        key={date.toISOString()}
        whileHover={{ scale: 1.02 }}
        onClick={() => onDateClick?.(date)}
        className={`
          relative p-2 h-24 border border-gray-200 cursor-pointer transition-all duration-200
          ${isCurrentMonth ? 'bg-white hover:bg-primary-50' : 'bg-gray-50 text-gray-400'}
          ${isCurrentDay ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${isCurrentDay ? 'text-primary-700' : ''}`}>
              {format(date, 'd')}
            </span>
            
            {totalEvents > 0 && (
              <div className="flex items-center space-x-1">
                {events.notes.length > 0 && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
                {events.tasks.length > 0 && (
                  <div className={`w-2 h-2 rounded-full ${
                    events.completedTasks.length === events.tasks.length 
                      ? 'bg-green-500' 
                      : 'bg-accent-500'
                  }`}></div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-1 overflow-hidden">
            {events.notes.slice(0, 2).map((note, index) => (
              <motion.div
                key={note.Id}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onNoteClick?.(note)
                }}
                className="text-xs p-1 bg-primary-100 text-primary-700 rounded truncate hover:bg-primary-200 transition-colors duration-150"
              >
                {note.title}
              </motion.div>
            ))}
            
            {events.tasks.slice(0, 2).map((task, index) => (
              <motion.div
                key={task.Id}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onNoteClick?.(task)
                }}
                className={`text-xs p-1 rounded truncate transition-colors duration-150 ${
                  task.completed 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 line-through' 
                    : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                }`}
              >
                {task.title}
              </motion.div>
            ))}

            {totalEvents > 4 && (
              <div className="text-xs text-gray-500 text-center">
                +{totalEvents - 4} more
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 font-display">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={() => navigateMonth(-1)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={() => navigateMonth(1)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <span>Notes</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
              <span>Tasks</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {/* Previous month padding */}
          {Array.from({ length: monthStart.getDay() }, (_, i) => {
            const paddingDate = new Date(monthStart)
            paddingDate.setDate(monthStart.getDate() - monthStart.getDay() + i)
            return renderCalendarDay(paddingDate)
          })}
          
          {/* Current month days */}
          {days.map(date => renderCalendarDay(date))}
          
          {/* Next month padding */}
          {Array.from({ length: 42 - (monthStart.getDay() + days.length) }, (_, i) => {
            const paddingDate = new Date(monthEnd)
            paddingDate.setDate(monthEnd.getDate() + i + 1)
            return renderCalendarDay(paddingDate)
          })}
        </div>
      </div>

      {/* Today's Agenda */}
      <div className="border-t border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
          Today's Agenda
        </h3>
        
        {(() => {
          const todayEvents = getDayEvents(new Date())
          const allEvents = [...todayEvents.notes, ...todayEvents.tasks]
          
          if (allEvents.length === 0) {
            return (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Calendar" size={32} className="mx-auto mb-2 text-gray-400" />
                <p>No events scheduled for today</p>
              </div>
            )
          }

          return (
            <div className="space-y-2">
              {allEvents.map(event => (
                <motion.div
                  key={event.Id}
                  whileHover={{ x: 4 }}
                  onClick={() => onNoteClick?.(event)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-150"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'note' ? 'bg-primary-500' : 
                    (event.completed ? 'bg-green-500' : 'bg-accent-500')
                  }`}></div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-gray-900 ${
                      event.completed ? 'line-through text-gray-500' : ''
                    }`}>
                      {event.title}
                    </h4>
                    {event.content && (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {event.content}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <ApperIcon 
                      name={event.type === 'task' ? 'CheckSquare' : 'FileText'} 
                      size={16} 
                      className="text-gray-400" 
                    />
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex space-x-1">
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
                </motion.div>
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default CalendarView