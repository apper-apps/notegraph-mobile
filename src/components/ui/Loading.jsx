import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'notes') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-soft border border-gray-100 p-4"
          >
          >
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 bg-primary-200 rounded animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-primary-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="flex space-x-2 mt-3">
                  <div className="h-5 bg-accent-200 rounded-full animate-pulse w-12" />
                  <div className="h-5 bg-accent-200 rounded-full animate-pulse w-16" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

if (type === 'calendar') {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
        <div className="space-y-4">
          <div className="h-8 bg-primary-200 rounded animate-pulse w-48" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

if (type === 'graph') {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-8 h-8 bg-primary-300 rounded-full absolute"
                style={{
                  left: `${20 + i * 40}px`,
                  top: `${20 + (i % 2) * 30}px`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-12">Loading graph visualization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <motion.div
          className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  )
}

export default Loading