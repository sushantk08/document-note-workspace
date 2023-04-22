import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NoteContext';
import { Search, X, ArrowDownUp, RefreshCw, LayoutGrid, List } from 'lucide-react';

export default function Header({ viewMode, setViewMode }) {
  const { filters, updateFilters, loading, loadNotes } = useNotes();
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilters({ search: searchInput });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title, content, tags, code..."
          className="w-full bg-slate-800/80 border border-slate-700/70 rounded-xl pl-9 pr-9 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 transition"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Actions & Sorting */}
      <div className="flex items-center gap-3">
        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value })}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="updated_at" className="bg-slate-800">Last Updated</option>
            <option value="created_at" className="bg-slate-800">Created Date</option>
            <option value="title" className="bg-slate-800">Title</option>
            {filters.search && <option value="relevance" className="bg-slate-800">Relevance</option>}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-800 border border-slate-700/60 rounded-xl p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'grid' ? 'bg-slate-700 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition ${
              viewMode === 'list' ? 'bg-slate-700 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Refresh */}
        <button
          onClick={loadNotes}
          disabled={loading}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-xl text-slate-300 transition"
          title="Reload Notes"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>
    </header>
  );
}