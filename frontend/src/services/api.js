import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesApi = {
  // Fetch notes with optional search, filters, and pagination
  getNotes: async (params = {}) => {
    const response = await apiClient.get('/notes', { params });
    return response.data;
  },

  // Fetch a single note by ID
  getNoteById: async (id) => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },

  // Create a new polymorphic note
  createNote: async (noteData) => {
    const response = await apiClient.post('/notes', noteData);
    return response.data;
  },

  // Update note fields partially
  updateNote: async (id, noteData) => {
    const response = await apiClient.patch(`/notes/${id}`, noteData);
    return response.data;
  },

  // Toggle pin status
  togglePin: async (id) => {
    const response = await apiClient.patch(`/notes/${id}/pin`);
    return response.data;
  },

  // Toggle archive status
  toggleArchive: async (id) => {
    const response = await apiClient.patch(`/notes/${id}/archive`);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    await apiClient.delete(`/notes/${id}`);
    return true;
  },

  // Get distinct tags and counts
  getTags: async () => {
    const response = await apiClient.get('/notes/tags');
    return response.data;
  },

  // Get workspace summary statistics
  getStats: async () => {
    const response = await apiClient.get('/notes/stats/summary');
    return response.data;
  },
};

export default apiClient;