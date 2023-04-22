import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';
import { FileText, CheckSquare, Code2, X } from 'lucide-react';

export default function NewNoteModal({ isOpen, onClose, onCreated }) {
  const { createNote } = useNotes();
  const [title, setTitle] = useState('');
  const [noteType, setNoteType] = useState('standard');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t);

      let payload = {
        title: title.trim(),
        note_type: noteType,
        tags,
        is_pinned: false,
        is_archived: false,
      };

      if (noteType === 'standard') {
        payload.content = '# ' + title.trim() + '\n\nStart writing markdown here...';
      } else if (noteType === 'checklist') {
        payload.items = [{ id: Date.now().toString(), text: 'First task item', completed: false }];
      } else if (noteType === 'code') {
        payload.code = '// Write your code snippet here\n';
        payload.language = 'javascript';
        payload.explanation = 'Snippet notes and documentation.';
      }

      const created = await createNote(payload);
      setTitle('');
      setTagsInput('');
      onClose();
      if (onCreated) onCreated(created);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-base font-bold text-slate-100">Create New Note</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note Type Selector */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'standard', label: 'Markdown', icon: FileText },
              { id: 'checklist', label: 'Checklist', icon: CheckSquare },
              { id: 'code', label: 'Code', icon: Code2 },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = noteType === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setNoteType(t.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-semibold ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Q3 Project Architecture"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g., project, architecture, backend"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition"
            >
              {submitting ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}