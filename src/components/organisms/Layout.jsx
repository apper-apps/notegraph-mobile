import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { noteService } from "@/services/api/noteService";
import Header from "@/components/organisms/Header";
import NoteEditor from "@/components/organisms/NoteEditor";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const handleCreateNote = () => {
    setEditingNote(null)
    setIsNoteEditorOpen(true)
  }

  const handleCreateTask = () => {
    setEditingNote(null)
    setIsNoteEditorOpen(true)
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
      setIsNoteEditorOpen(false)
      setEditingNote(null)
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
        setIsNoteEditorOpen(false)
        setEditingNote(null)
      } catch (error) {
        toast.error('Failed to delete note. Please try again.')
        console.error('Error deleting note:', error)
      }
    }
  }

return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onCreateNote={handleCreateNote}
        onCreateTask={handleCreateTask}
/>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        <Header 
          onMenuToggle={toggleSidebar}
        />
        <main className="flex-1 p-6 overflow-auto">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Note Editor Sidebar */}
      <NoteEditor
        note={editingNote}
        isOpen={isNoteEditorOpen}
        onClose={() => setIsNoteEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  )
}

export default Layout