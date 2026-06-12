'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStore } from '@/lib/store';

type Mode = 'edit' | 'preview';

export default function DocsPage() {
  const { docs, addDocPage, updateDocPage, deleteDocPage } = useStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('edit');
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Select first doc on mount
  useEffect(() => {
    if (docs.length > 0 && selectedId === null) {
      setSelectedId(docs[0].id);
    }
  }, [docs, selectedId]);

  const selectedDoc = docs.find(d => d.id === selectedId) ?? null;

  // Sync local state when selected doc changes
  useEffect(() => {
    if (selectedDoc) {
      setLocalTitle(selectedDoc.title);
      setLocalContent(selectedDoc.content);
    }
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveContent = (content: string) => {
    if (!selectedId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      updateDocPage(selectedId, { content });
    }, 400);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    saveContent(e.target.value);
  };

  const handleTitleBlur = () => {
    if (selectedId && localTitle.trim() && localTitle !== selectedDoc?.title) {
      updateDocPage(selectedId, { title: localTitle.trim() });
    }
  };

  const handleNewPage = () => {
    const id = addDocPage('Untitled');
    setSelectedId(id);
    setLocalTitle('Untitled');
    setLocalContent('');
    setMode('edit');
  };

  const handleSelect = (id: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (selectedId) updateDocPage(selectedId, { content: localContent });
    setSelectedId(id);
    setMode('edit');
  };

  const handleDelete = (id: string) => {
    deleteDocPage(id);
    setDeleteConfirm(null);
    const remaining = docs.filter(d => d.id !== id);
    setSelectedId(remaining[0]?.id ?? null);
  };

  return (
    <div className="flex h-[calc(100vh-52px)]">
      {/* Pages sidebar */}
      <aside className="w-[220px] flex-shrink-0 border-r border-[rgba(139,143,212,0.15)] flex flex-col bg-surface">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(139,143,212,0.15)]">
          <span className="text-[10px] font-medium tracking-widest text-text-tertiary uppercase">Pages</span>
          <button
            onClick={handleNewPage}
            className="p-1 rounded hover:bg-elevated text-text-tertiary hover:text-text-primary transition-colors"
            title="New page"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-1.5">
          {docs.length === 0 ? (
            <p className="text-[12px] text-text-tertiary text-center py-10">No pages yet</p>
          ) : (
            docs.map(doc => (
              <button
                key={doc.id}
                onClick={() => handleSelect(doc.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors ${
                  selectedId === doc.id
                    ? 'text-text-primary bg-elevated border-l-2 border-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-container-low border-l-2 border-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] flex-shrink-0 opacity-60">description</span>
                <span className="truncate">{doc.title || 'Untitled'}</span>
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* Main area */}
      {selectedDoc ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-3 border-b border-[rgba(139,143,212,0.15)] flex-shrink-0">
            <input
              value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onBlur={handleTitleBlur}
              className="flex-1 text-[20px] font-semibold text-text-primary bg-transparent focus:outline-none placeholder-text-tertiary min-w-0"
              placeholder="Page title..."
            />

            {/* Edit / Preview toggle */}
            <div className="flex rounded-lg border border-[rgba(139,143,212,0.2)] overflow-hidden flex-shrink-0">
              {(['edit', 'preview'] as Mode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${
                    mode === m
                      ? 'bg-elevated text-text-primary'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Delete */}
            {deleteConfirm === selectedDoc.id ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] text-text-secondary">Delete?</span>
                <button
                  onClick={() => handleDelete(selectedDoc.id)}
                  className="text-[11px] font-medium text-error hover:underline"
                >
                  Yes
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-[11px] text-text-tertiary hover:underline"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirm(selectedDoc.id)}
                className="flex-shrink-0 p-1.5 rounded hover:bg-error/10 text-text-tertiary hover:text-error transition-colors"
                title="Delete page"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {mode === 'edit' ? (
              <textarea
                value={localContent}
                onChange={handleContentChange}
                className="w-full h-full px-8 py-6 bg-transparent text-[13px] font-mono text-text-primary placeholder-text-tertiary focus:outline-none resize-none leading-relaxed"
                placeholder={'# Page title\n\nStart writing in Markdown...'}
                spellCheck={false}
              />
            ) : (
              <div className="h-full overflow-y-auto px-8 py-6">
                <div className="doc-prose max-w-3xl">
                  {localContent.trim() ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {localContent}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-text-tertiary text-[13px] italic">Nothing to preview. Switch to Edit to start writing.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-2 border-t border-[rgba(139,143,212,0.08)] flex-shrink-0">
            <p className="text-[10px] text-text-tertiary">
              Updated {new Date(selectedDoc.updatedAt).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-text-tertiary">
          <span className="material-symbols-outlined text-[56px] opacity-20">description</span>
          <p className="text-[14px]">No page selected</p>
          <button onClick={handleNewPage} className="text-[13px] text-primary hover:underline">
            Create your first page
          </button>
        </div>
      )}
    </div>
  );
}