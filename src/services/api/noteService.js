class NoteService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'note'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "folder_id" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          { fieldName: "updated_at", sorttype: "DESC" }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      // Map database fields to UI expected format
      const mappedData = (response.data || []).map(item => ({
        Id: item.Id,
        title: item.title || item.Name || '',
        content: item.content || '',
        type: item.type || 'note',
        date: item.date,
        tags: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        folderId: item.folder_id || '',
        completed: item.completed || false,
        createdAt: item.created_at || item.CreatedOn,
        updatedAt: item.updated_at || item.ModifiedOn
      }))

      return mappedData
    } catch (error) {
      console.error("Error fetching notes:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "date" } },
          { field: { Name: "folder_id" } },
          { field: { Name: "completed" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (!response.data) {
        throw new Error('Note not found')
      }

      // Map database fields to UI expected format
      const item = response.data
      return {
        Id: item.Id,
        title: item.title || item.Name || '',
        content: item.content || '',
        type: item.type || 'note',
        date: item.date,
        tags: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        folderId: item.folder_id || '',
        completed: item.completed || false,
        createdAt: item.created_at || item.CreatedOn,
        updatedAt: item.updated_at || item.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching note with ID ${id}:`, error)
      throw error
    }
  }

  async create(noteData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: noteData.title || '',
          Tags: noteData.tags ? noteData.tags.join(', ') : '',
          title: noteData.title || '',
          content: noteData.content || '',
          type: noteData.type || 'note',
          date: noteData.date ? new Date(noteData.date).toISOString() : null,
          folder_id: noteData.folderId || '',
          completed: noteData.completed || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to create note')
        }

        const successfulRecord = response.results.find(result => result.success)
        if (successfulRecord && successfulRecord.data) {
          const item = successfulRecord.data
          return {
            Id: item.Id,
            title: item.title || item.Name || '',
            content: item.content || '',
            type: item.type || 'note',
            date: item.date,
            tags: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            folderId: item.folder_id || '',
            completed: item.completed || false,
            createdAt: item.created_at || item.CreatedOn,
            updatedAt: item.updated_at || item.ModifiedOn
          }
        }
      }

      throw new Error('Unexpected response format')
    } catch (error) {
      console.error("Error creating note:", error)
      throw error
    }
  }

  async update(id, noteData) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: noteData.title || '',
          Tags: noteData.tags ? noteData.tags.join(', ') : '',
          title: noteData.title || '',
          content: noteData.content || '',
          type: noteData.type || 'note',
          date: noteData.date ? new Date(noteData.date).toISOString() : null,
          folder_id: noteData.folderId || '',
          completed: noteData.completed || false,
          updated_at: new Date().toISOString()
        }]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to update note')
        }

        const successfulRecord = response.results.find(result => result.success)
        if (successfulRecord && successfulRecord.data) {
          const item = successfulRecord.data
          return {
            Id: item.Id,
            title: item.title || item.Name || '',
            content: item.content || '',
            type: item.type || 'note',
            date: item.date,
            tags: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            folderId: item.folder_id || '',
            completed: item.completed || false,
            createdAt: item.created_at || item.CreatedOn,
            updatedAt: item.updated_at || item.ModifiedOn
          }
        }
      }

      throw new Error('Unexpected response format')
    } catch (error) {
      console.error("Error updating note:", error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          throw new Error(failedRecords[0].message || 'Failed to delete note')
        }

        return true
      }

      return true
    } catch (error) {
      console.error("Error deleting note:", error)
      throw error
    }
  }
}

export const noteService = new NoteService()