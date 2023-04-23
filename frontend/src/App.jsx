import React, { useState } from 'react';
import { useNotes } from './context/NoteContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NoteCard from './components/NoteCard';
import NewNoteModal from './components/NewNoteModal';
import NoteEditor from './components/NoteEditor';
import { FileText, Plus } from 'lucide-react';

export default function App() {
  const { notes, loading, selectedNote, setSelectedNote } = useNotes();
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pinnedNotes = notes.filter((n) => n.is_pinned);
  const otherNotes = notes.filter((n) => !n.is_pinned);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar onOpenNewModal={() => setIsModalOpen(true)} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header viewMode={viewMode} setViewMode={setViewMode} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {loading && notes.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-4 text-slate-500">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-slate-300 mb-1">No notes found</h3>
              <p className="text-xs text-slate-500 mb-5">
                Create your first polymorphic note or try adjusting your search filters.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg transition"
              >
                <Plus className="w-4 h-4" />
                Create Note
              </button>
            </div>
          ) : (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Pinned Notes Section */}
              {pinnedNotes.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    Pinned Notes ({pinnedNotes.length})
                  </h2>
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                        : 'space-y-3'
                    }
                  >
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note._id} note={note} onSelect={setSelectedNote} />
                    ))}
                  </div>
                </section>
              )}

              {/* Other Notes Section */}
              {otherNotes.length > 0 && (
                <section>
                  {pinnedNotes.length > 0 && (
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Other Notes ({otherNotes.length})
                    </h2>
                  )}
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                        : 'space-y-3'
                    }
                  >
                    {otherNotes.map((note) => (
                      <NoteCard key={note._id} note={note} onSelect={setSelectedNote} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>

      {/* New Note Creation Modal */}
      <NewNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(created) => setSelectedNote(created)}
      />

      {/* Polymorphic Note Editor Modal */}
      {selectedNote && (
        <NoteEditor
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
}