import mockNotes from '@/services/mockData/notes.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class NoteService {
  constructor() {
    this.notes = [...mockNotes]
  }

  async getAll() {
    await delay(300)
    return [...this.notes]
  }

  async getById(id) {
    await delay(200)
    const note = this.notes.find(n => n.Id === parseInt(id))
    if (!note) {
      throw new Error('Note not found')
    }
    return { ...note }
  }

  async create(noteData) {
    await delay(400)
    
    const newNote = {
      ...noteData,
      Id: Math.max(...this.notes.map(n => n.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.notes.push(newNote)
    return { ...newNote }
  }

  async update(id, noteData) {
    await delay(350)
    
    const index = this.notes.findIndex(n => n.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Note not found')
    }
    
    const updatedNote = {
      ...this.notes[index],
      ...noteData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    
    this.notes[index] = updatedNote
    return { ...updatedNote }
  }

  async delete(id) {
    await delay(250)
    
    const index = this.notes.findIndex(n => n.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Note not found')
    }
    
    const deletedNote = this.notes.splice(index, 1)[0]
    return { ...deletedNote }
  }
}

export const noteService = new NoteService()