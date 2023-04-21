import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notesApi } from '../services/api';

const NoteContext = createContext();

export function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [selectedNote, setSelectedNote] = useState(null);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active workspace filters
  const [filters, setFilters] = useState({
    search: '',
    tag: null,
    noteType: null,
    isArchived: false,
    sortBy: 'updated_at',
    sortOrder: 'desc',
    skip: 0,
    limit: 50,
  });

  // Fetch list of notes based on current filters
  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        skip: filters.skip,
        limit: filters.limit,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
        is_archived: filters.isArchived,
      };

      if (filters.search) params.search = filters.search;
      if (filters.tag) params.tag = filters.tag;
      if (filters.noteType) params.note_type = filters.noteType;

      const data = await notesApi.getNotes(params);
      setNotes(data.items || []);
      setTotalNotes(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError(err.response?.data?.detail || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch tags and summary stats
  const loadMetadata = useCallback(async () => {
    try {
      const [tagsData, statsData] = await Promise.all([
        notesApi.getTags(),
        notesApi.getStats(),
      ]);
      setTags(tagsData || []);
      setStats(statsData || null);
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  }, []);

  useEffect(() => {
    loadNotes();
    loadMetadata();
  }, [loadNotes, loadMetadata]);

  // Note CRUD Actions
  const createNote = async (notePayload) => {
    const created = await notesApi.createNote(notePayload);
    await loadNotes();
    await loadMetadata();
    setSelectedNote(created);
    return created;
  };

  const updateNote = async (id, updatePayload) => {
    const updated = await notesApi.updateNote(id, updatePayload);
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    if (selectedNote?._id === id) {
      setSelectedNote(updated);
    }
    loadMetadata();
    return updated;
  };

  const togglePin = async (id) => {
    const updated = await notesApi.togglePin(id);
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    if (selectedNote?._id === id) setSelectedNote(updated);
    loadMetadata();
  };

  const toggleArchive = async (id) => {
    await notesApi.toggleArchive(id);
    await loadNotes();
    await loadMetadata();
    if (selectedNote?._id === id) setSelectedNote(null);
  };

  const deleteNote = async (id) => {
    await notesApi.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    if (selectedNote?._id === id) setSelectedNote(null);
    loadMetadata();
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, skip: 0 }));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        totalNotes,
        selectedNote,
        setSelectedNote,
        tags,
        stats,
        loading,
        error,
        filters,
        updateFilters,
        loadNotes,
        createNote,
        updateNote,
        togglePin,
        toggleArchive,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};