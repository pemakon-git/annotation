'use client';

import { useState } from 'react';
import { useStore, EnvVar, EnvEnvironment } from '@/lib/store';

const ENV_TABS: { key: EnvEnvironment; label: string; color: string }[] = [
  { key: 'dev', label: 'Development', color: '#4ade80' },
  { key: 'staging', label: 'Staging', color: '#e1c562' },
  { key: 'prod', label: 'Production', color: '#FB7185' },
];

interface EnvVarRowProps {
  variable: EnvVar;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onUpdate: (updates: Partial<Omit<EnvVar, 'id'>>) => void;
  onDelete: () => void;
}

function EnvVarRow({ variable, isVisible, onToggleVisibility, onUpdate, onDelete }: EnvVarRowProps) {
  const [key, setKey] = useState(variable.key);
  const [value, setValue] = useState(variable.value);

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 group hover:bg-elevated/50 transition-colors">
      <input
        value={key}
        onChange={e => setKey(e.target.value.toUpperCase().replace(/\s/g, '_'))}
        onBlur={() => key !== variable.key && onUpdate({ key })}
        className="w-2/5 bg-transparent border border-transparent hover:border-[rgba(139,143,212,0.2)] focus:border-primary rounded px-2 py-1 text-[12px] font-mono text-text-primary focus:outline-none transition-colors"
        spellCheck={false}
      />
      <span className="text-text-tertiary text-[12px] font-mono flex-shrink-0">=</span>
      <div className="flex-1 flex items-center gap-1 min-w-0">
        <input
          type={variable.isSecret && !isVisible ? 'password' : 'text'}
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={() => value !== variable.value && onUpdate({ value })}
          className="flex-1 bg-transparent border border-transparent hover:border-[rgba(139,143,212,0.2)] focus:border-primary rounded px-2 py-1 text-[12px] font-mono text-text-secondary focus:outline-none transition-colors min-w-0"
          spellCheck={false}
        />
        {variable.isSecret && (
          <button
            onClick={onToggleVisibility}
            className="flex-shrink-0 p-1 rounded text-text-tertiary hover:text-text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isVisible ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      <button
        onClick={onDelete}
        className="flex-shrink-0 p-1 rounded text-transparent group-hover:text-text-tertiary hover:!text-error transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">delete</span>
      </button>
    </div>
  );
}

interface EnvPanelProps {
  projectId: string;
  onClose: () => void;
}

export default function EnvPanel({ projectId, onClose }: EnvPanelProps) {
  const { projects, addEnvVar, updateEnvVar, deleteEnvVar } = useStore();
  const project = projects[projectId];

  const [activeEnv, setActiveEnv] = useState<EnvEnvironment>('dev');
  const [visibleValues, setVisibleValues] = useState<Set<string>>(new Set());
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newIsSecret, setNewIsSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!project) return null;

  const envVars = project.envSets?.[activeEnv] ?? [];
  const activeTab = ENV_TABS.find(t => t.key === activeEnv)!;

  const toggleVisibility = (id: string) => {
    setVisibleValues(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    if (!newKey.trim()) return;
    addEnvVar(projectId, activeEnv, { key: newKey.trim(), value: newValue, isSecret: newIsSecret });
    setNewKey('');
    setNewValue('');
    setNewIsSecret(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleCopy = () => {
    const content = envVars.map(v => `${v.key}=${v.value}`).join('\n');
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-surface border-l border-[rgba(139,143,212,0.2)] flex flex-col h-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(139,143,212,0.15)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px] text-primary">vpn_key</span>
            <div>
              <h2 className="text-[15px] font-semibold text-text-primary">Environment Variables</h2>
              <p className="text-[11px] text-text-tertiary">{project.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-elevated text-text-tertiary hover:text-text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Env tabs */}
        <div className="flex border-b border-[rgba(139,143,212,0.15)] flex-shrink-0">
          {ENV_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveEnv(tab.key)}
              className={`flex-1 py-2.5 text-[12px] font-medium transition-colors relative ${
                activeEnv === tab.key ? 'text-text-primary' : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tab.color }} />
                {tab.label}
              </span>
              {activeEnv === tab.key && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                  style={{ backgroundColor: tab.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Column headers */}
        {envVars.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[rgba(139,143,212,0.08)] flex-shrink-0">
            <span className="w-2/5 text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Key</span>
            <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest w-3">-</span>
            <span className="flex-1 text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Value</span>
          </div>
        )}

        {/* Var list */}
        <div className="flex-1 overflow-y-auto">
          {envVars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
              <span className="material-symbols-outlined text-[48px] mb-3 opacity-40">lock</span>
              <p className="text-[13px]">No variables yet</p>
              <p className="text-[11px] mt-1 opacity-60">
                Add your first{' '}
                <span className="font-mono" style={{ color: activeTab.color }}>{activeTab.label}</span>{' '}
                variable below
              </p>
            </div>
          ) : (
            <div className="py-1">
              {envVars.map(v => (
                <EnvVarRow
                  key={v.id}
                  variable={v}
                  isVisible={visibleValues.has(v.id)}
                  onToggleVisibility={() => toggleVisibility(v.id)}
                  onUpdate={updates => updateEnvVar(projectId, activeEnv, v.id, updates)}
                  onDelete={() => deleteEnvVar(projectId, activeEnv, v.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add new var */}
        <div className="border-t border-[rgba(139,143,212,0.15)] p-4 space-y-3 bg-surface-container-low flex-shrink-0">
          <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-widest">Add Variable</p>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newKey}
              onChange={e => setNewKey(e.target.value.toUpperCase().replace(/\s/g, '_'))}
              onKeyDown={handleKeyDown}
              placeholder="KEY"
              className="w-2/5 bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[12px] font-mono text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
            <span className="text-text-tertiary text-[12px] font-mono flex-shrink-0">=</span>
            <input
              type={newIsSecret ? 'password' : 'text'}
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="value"
              className="flex-1 bg-background border border-[rgba(139,143,212,0.15)] rounded-lg px-3 py-2 text-[12px] font-mono text-text-primary placeholder-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newIsSecret}
                onChange={e => setNewIsSecret(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
              />
              <span className="text-[12px] text-text-secondary">Secret</span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={envVars.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(139,143,212,0.2)] text-[11px] text-text-secondary hover:text-text-primary hover:border-[rgba(139,143,212,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[13px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied!' : 'Copy .env'}
              </button>
              <button
                onClick={handleAdd}
                disabled={!newKey.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container text-[11px] font-medium hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[13px]">add</span>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}