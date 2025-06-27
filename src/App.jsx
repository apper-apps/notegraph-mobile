import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import NotesPage from '@/components/pages/NotesPage'
import TasksPage from '@/components/pages/TasksPage'
import CalendarPage from '@/components/pages/CalendarPage'
import GraphPage from '@/components/pages/GraphPage'
import SearchPage from '@/components/pages/SearchPage'

function App() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NotesPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App