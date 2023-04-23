import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NoteContext';
import MarkdownRenderer from './MarkdownRenderer';
import {
  X,
  Star,
  Archive,
  Trash2,
  Tag,
  Plus,
  Copy,
  Check,
  CheckSquare,
  Square,
  FileText,
  Code2,
  Eye,
  Edit3,
} from 'lucide-react';

export default function NoteEditor({ note, onClose }) {
  const { updateNote, togglePin, toggleArchive, deleteNote } = useNotes();

  const [title, setTitle] = useState(note?.title || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  // Standard Markdown State
  const [content, setContent] = useState(note?.content || '');
  const [previewTab, setPreviewTab] = useState('split'); // 'edit', 'preview', 'split'

  // Checklist State
  const [items, setItems] = useState(note?.items || []);
  const [newItemText, setNewItemText] = useState('');

  // Code Snippet State
  const [code, setCode] = useState(note?.code || '');
  const [language, setLanguage] = useState(note?.language || 'javascript');
  const [explanation, setExplanation] = useState(note?.explanation || '');
  const [copied, setCopied] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setTags(note.tags || []);
      setContent(note.content || '');
      setItems(note.items || []);
      setCode(note.code || '');
      setLanguage(note.language || 'javascript');
      setExplanation(note.explanation || '');
    }
  }, [note?._id]);

  if (!note) return null;

  // Save changes to backend
  const handleSave = async (overrides = {}) => {
    setIsSaving(true);
    try {
      const payload = {
        title,
        tags,
        content,
        items,
        code,
        language,
        explanation,
        ...overrides,
      };
      await updateNote(note._id, payload);
    } catch (err) {
      console.error('Failed to update note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Tag Handlers
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const cleaned = tagInput.trim().toLowerCase();
      if (!tags.includes(cleaned)) {
        const nextTags = [...tags, cleaned];
        setTags(nextTags);
        handleSave({ tags: nextTags });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const nextTags = tags.filter((t) => t !== tagToRemove);
    setTags(nextTags);
    handleSave({ tags: nextTags });
  };

  // Checklist Handlers
  const handleToggleCheckItem = (id) => {
    const nextItems = items.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it));
    setItems(nextItems);
    handleSave({ items: nextItems });
  };

  const handleAddCheckItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const nextItems = [...items, { id: Date.now().toString(), text: newItemText.trim(), completed: false }];
    setItems(nextItems);
    setNewItemText('');
    handleSave({ items: nextItems });
  };

  const handleDeleteCheckItem = (id) => {
    const nextItems = items.filter((it) => it.id !== id);
    setItems(nextItems);
    handleSave({ items: nextItems });
  };

  // Copy Code Handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 md:p-6">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg">
              {note.note_type}
            </span>
            <span className="text-xs text-slate-500">
              {isSaving ? 'Saving changes...' : 'All changes saved'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => togglePin(note._id)}
              className={`p-2 rounded-xl border border-slate-700/60 hover:bg-slate-800 transition ${
                note.is_pinned ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
              }`}
              title={note.is_pinned ? 'Unpin' : 'Pin note'}
            >
              <Star className={`w-4 h-4 ${note.is_pinned ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => toggleArchive(note._id)}
              className={`p-2 rounded-xl border border-slate-700/60 hover:bg-slate-800 transition ${
                note.is_archived ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400'
              }`}
              title={note.is_archived ? 'Restore' : 'Archive'}
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Delete this note permanently?')) {
                  deleteNote(note._id);
                  onClose();
                }
              }}
              className="p-2 rounded-xl border border-slate-700/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-6 bg-slate-800 mx-1" />
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Tags Header */}
        <div className="px-6 pt-5 pb-3 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleSave()}
            placeholder="Untitled Note"
            className="w-full bg-transparent text-xl font-bold text-slate-100 placeholder-slate-600 focus:outline-none"
          />

          {/* Tags Manager */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg"
              >
                <Tag className="w-3 h-3 text-slate-500" />
                #{t}
                <button
                  onClick={() => handleRemoveTag(t)}
                  className="hover:text-rose-400 ml-0.5 text-slate-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="+ add tag"
              className="bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none px-2 py-1"
            />
          </div>
        </div>

        {/* Polymorphic Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          {/* 1. STANDARD MARKDOWN NOTE */}
          {note.note_type === 'standard' && (
            <div className="h-full flex flex-col space-y-3">
              <div className="flex items-center justify-end gap-1 pb-2 border-b border-slate-800 text-xs text-slate-400">
                <button
                  onClick={() => setPreviewTab('edit')}
                  className={`px-3 py-1 rounded-lg ${previewTab === 'edit' ? 'bg-slate-800 text-emerald-400' : 'hover:text-slate-200'}`}
                >
                  <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => setPreviewTab('split')}
                  className={`hidden md:block px-3 py-1 rounded-lg ${previewTab === 'split' ? 'bg-slate-800 text-emerald-400' : 'hover:text-slate-200'}`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setPreviewTab('preview')}
                  className={`px-3 py-1 rounded-lg ${previewTab === 'preview' ? 'bg-slate-800 text-emerald-400' : 'hover:text-slate-200'}`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100%-40px)]">
                {(previewTab === 'edit' || previewTab === 'split') && (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={() => handleSave()}
                    placeholder="Write Markdown here..."
                    className="w-full h-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-slate-200 font-mono text-sm resize-none focus:outline-none focus:border-slate-700"
                  />
                )}
                {(previewTab === 'preview' || previewTab === 'split') && (
                  <div className="w-full h-full bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 overflow-y-auto">
                    <MarkdownRenderer content={content} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. CHECKLIST NOTE */}
          {note.note_type === 'checklist' && (
            <div className="space-y-5 max-w-2xl">
              {/* Progress Bar */}
              <div className="space-y-1.5 bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Completion Progress</span>
                  <span className="text-emerald-400">{completedCount} of {items.length} ({progressPercent}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Task Items */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 rounded-xl group transition"
                  >
                    <button
                      onClick={() => handleToggleCheckItem(item.id)}
                      className="flex items-center gap-3 text-sm text-left flex-1"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      )}
                      <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {item.text}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteCheckItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Item Form */}
              <form onSubmit={handleAddCheckItem} className="flex gap-2">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add a new checklist task..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </div>
          )}

          {/* 3. CODE SNIPPET NOTE */}
          {note.note_type === 'code' && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      handleSave({ language: e.target.value });
                    }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-purple-300 focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="typescript">TypeScript</option>
                    <option value="sql">SQL</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="json">JSON</option>
                    <option value="bash">Bash / Shell</option>
                  </select>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              {/* Code Box */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onBlur={() => handleSave()}
                placeholder="// Paste or write code snippet here..."
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-purple-200 resize-none focus:outline-none focus:border-purple-500/50"
              />

              {/* Documentation / Explanation */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Documentation & Notes</label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  onBlur={() => handleSave()}
                  placeholder="Add documentation or context about this code snippet..."
                  rows={4}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}