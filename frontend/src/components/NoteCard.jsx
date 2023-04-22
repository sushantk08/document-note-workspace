import React from 'react';
import { useNotes } from '../context/NoteContext';
import {
  FileText,
  CheckSquare,
  Code2,
  Star,
  Archive,
  Trash2,
  Tag,
} from 'lucide-react';

export default function NoteCard({ note, onSelect }) {
  const { togglePin, toggleArchive, deleteNote } = useNotes();

  const getTypeBadge = () => {
    switch (note.note_type) {
      case 'checklist':
        const completedCount = note.items?.filter((i) => i.completed).length || 0;
        return {
          icon: CheckSquare,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          label: `${completedCount}/${note.items?.length || 0} tasks`,
        };
      case 'code':
        return {
          icon: Code2,
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          label: note.language || 'code',
        };
      default:
        return {
          icon: FileText,
          color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          label: 'Markdown',
        };
    }
  };

  const badge = getTypeBadge();
  const BadgeIcon = badge.icon;

  const formattedDate = new Date(note.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => onSelect(note)}
      className="group relative bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer"
    >
      <div>
        {/* Top Header: Badge & Pin */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${badge.color}`}>
            <BadgeIcon className="w-3.5 h-3.5" />
            <span className="capitalize">{badge.label}</span>
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note._id);
              }}
              className={`p-1.5 rounded-lg hover:bg-slate-700/60 transition ${
                note.is_pinned ? 'text-amber-400 fill-amber-400' : 'text-slate-400'
              }`}
              title={note.is_pinned ? 'Unpin' : 'Pin to top'}
            >
              <Star className={`w-4 h-4 ${note.is_pinned ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-100 text-base leading-snug line-clamp-1 mb-2">
          {note.title}
        </h3>

        {/* Content Snippet / Summary */}
        <div className="text-xs text-slate-400 line-clamp-3 mb-4 font-mono bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
          {note.note_type === 'standard' && (note.content || 'Empty note...')}
          {note.note_type === 'code' && (note.code || '// Empty code snippet')}
          {note.note_type === 'checklist' && (
            note.items?.length > 0
              ? note.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5 truncate">
                    <span className={item.completed ? 'line-through text-slate-600' : ''}>
                      • {item.text}
                    </span>
                  </div>
                ))
              : 'No checklist items'
          )}
        </div>
      </div>

      {/* Footer: Tags & Actions */}
      <div>
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded-md"
              >
                <Tag className="w-2.5 h-2.5 text-slate-500" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center">+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-500">
          <span>{formattedDate}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchive(note._id);
              }}
              className="p-1 rounded hover:bg-slate-700 hover:text-slate-300"
              title={note.is_archived ? 'Restore' : 'Archive'}
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this note permanently?')) {
                  deleteNote(note._id);
                }
              }}
              className="p-1 rounded hover:bg-rose-500/20 hover:text-rose-400"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}