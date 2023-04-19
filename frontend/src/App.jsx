import React from 'react';
import { FileText, CheckSquare, Code2, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Note & Document Workspace
        </h1>
        <p className="text-slate-400 mb-6 text-sm">
          React + Tailwind CSS + FastAPI + MongoDB
        </p>

        <div className="grid grid-cols-3 gap-3 text-left">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex flex-col gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-semibold text-slate-300">Markdown</span>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex flex-col gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Checklists</span>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex flex-col gap-2">
            <Code2 className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-semibold text-slate-300">Code Snippets</span>
          </div>
        </div>
      </div>
    </div>
  );
}