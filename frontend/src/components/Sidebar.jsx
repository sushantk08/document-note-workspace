import React from 'react';
import { useNotes } from '../context/NoteContext';
import {
  FileText,
  CheckSquare,
  Code2,
  Archive,
  Star,
  Tag,
  Plus,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ onOpenNewModal }) {
  const { filters, updateFilters, tags, stats } = useNotes();

  const noteTypes = [
    { id: null, label: 'All Notes', icon: Layers, count: stats?.active_notes ?? 0 },
    { id: 'standard', label: 'Markdown', icon: FileText, count: stats?.standard_count ?? 0 },
    { id: 'checklist', label: 'Checklists', icon: CheckSquare, count: stats?.checklist_count ?? 0 },
    { id: 'code', label: 'Code Snippets', icon: Code2, count: stats?.code_count ?? 0 },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 leading-tight">DocWorkspace</h1>
            <span className="text-[11px] text-slate-500">Polymorphic Notes</span>
          </div>
        </div>
      </div>

      {/* New Note Button */}
      <div className="p-4">
        <button
          onClick={onOpenNewModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-900/20 transition active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6 text-xs font-medium">
        {/* Core Categories */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Views
          </span>
          {noteTypes.map((item) => {
            const Icon = item.icon;
            const isActive = !filters.isArchived && filters.noteType === item.id && !filters.isPinned;
            return (
              <button
                key={item.label}
                onClick={() => updateFilters({ noteType: item.id, isArchived: false, isPinned: null })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[11px] text-slate-500">{item.count}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filters */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Quick Filters
          </span>
          <button
            onClick={() => updateFilters({ isPinned: true, isArchived: false, noteType: null })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              filters.isPinned === true && !filters.isArchived
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Pinned Notes</span>
            </div>
            <span className="text-[11px] text-slate-500">{stats?.pinned_notes ?? 0}</span>
          </button>

          <button
            onClick={() => updateFilters({ isArchived: true, isPinned: null, noteType: null })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
              filters.isArchived
                ? 'bg-slate-800 text-purple-400 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Archive className="w-4 h-4 text-purple-400" />
              <span>Archived</span>
            </div>
            <span className="text-[11px] text-slate-500">{stats?.archived_notes ?? 0}</span>
          </button>
        </div>

        {/* Dynamic Tags from MongoDB */}
        <div className="space-y-1 pb-4">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tags</span>
            {filters.tag && (
              <button
                onClick={() => updateFilters({ tag: null })}
                className="text-[10px] text-emerald-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {tags.length === 0 ? (
            <p className="px-3 py-2 text-[11px] text-slate-600">No tags created yet</p>
          ) : (
            tags.map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => updateFilters({ tag: filters.tag === tag ? null : tag })}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition ${
                  filters.tag === tag
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Tag className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">#{tag}</span>
                </div>
                <span className="text-[10px] text-slate-500">{count}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}