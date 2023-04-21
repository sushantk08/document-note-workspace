import React from 'react';
import { useNotes } from './context/NoteContext';
import { Sparkles, FileText, Tag, RefreshCw } from 'lucide-react';

export default function App() {
  const { notes, totalNotes, stats, tags, loading, error, loadNotes } = useNotes();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Document & Note Management Workspace</h1>
              <p className="text-xs text-slate-400">State Layer & API Integration Connected</p>
            </div>
          </div>
          <button
            onClick={loadNotes}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm rounded-lg border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm">
            {error} (Ensure backend server is running on port 8000)
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <span className="text-xs text-slate-400">Total Notes</span>
            <p className="text-2xl font-bold text-slate-100">{totalNotes}</p>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <span className="text-xs text-slate-400">Active Notes</span>
            <p className="text-2xl font-bold text-emerald-400">{stats?.active_notes ?? 0}</p>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <span className="text-xs text-slate-400">Pinned</span>
            <p className="text-2xl font-bold text-amber-400">{stats?.pinned_notes ?? 0}</p>
          </div>
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <span className="text-xs text-slate-400">Total Tags</span>
            <p className="text-2xl font-bold text-blue-400">{tags.length}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Loaded Notes ({notes.length})
          </h2>
          {notes.length === 0 ? (
            <p className="text-sm text-slate-500">No notes found. Create some via Swagger API or in the upcoming UI.</p>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note._id} className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/40 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-slate-200">{note.title}</h3>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{note.note_type}</span>
                  </div>
                  <div className="flex gap-1">
                    {note.tags?.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}