'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '@/lib/project-context';
import {
  ChevronDown,
  Plus,
  Globe,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CORES_PRESET = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#3b82f6', '#a855f7',
];

export function ProjectSwitcher() {
  const { projetoAtivo, setProjetoAtivo, projetos, projetoAtivoInfo, addProjeto, updateProjeto, deleteProjeto } = useProject();
  const [open, setOpen] = useState(false);
  const [showNovo, setShowNovo] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Estado do form "Novo Projeto"
  const [novoNome, setNovoNome] = useState('');
  const [novaDesc, setNovaDesc] = useState('');
  const [novaCor, setNovaCor] = useState('#6366f1');
  const [salvando, setSalvando] = useState(false);

  // Estado do form "Editar Projeto"
  const [editNome, setEditNome] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCor, setEditCor] = useState('#6366f1');

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowNovo(false);
        setEditandoId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function criarProjeto() {
    if (!novoNome.trim()) return;
    setSalvando(true);
    try {
      const novo = await addProjeto({ nome: novoNome.trim(), descricao: novaDesc.trim(), cor: novaCor });
      setProjetoAtivo(novo.id);
      setNovoNome('');
      setNovaDesc('');
      setNovaCor('#6366f1');
      setShowNovo(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(p: { id: string; nome: string; descricao: string; cor: string }) {
    setEditandoId(p.id);
    setEditNome(p.nome);
    setEditDesc(p.descricao);
    setEditCor(p.cor);
  }

  async function salvarEdicao(id: string) {
    if (!editNome.trim()) return;
    setSalvando(true);
    try {
      await updateProjeto(id, { nome: editNome.trim(), descricao: editDesc.trim(), cor: editCor });
      setEditandoId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  }

  async function excluirProjeto(id: string, nome: string) {
    if (!confirm(`Excluir o projeto "${nome}" e todos os seus dados? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteProjeto(id);
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir projeto');
    }
  }

  const nomeProjeto = projetoAtivo === 'all'
    ? 'Todos os Projetos'
    : projetoAtivoInfo?.nome || 'Projeto';

  const corProjeto = projetoAtivo === 'all' ? '#6366f1' : projetoAtivoInfo?.cor || '#6366f1';

  return (
    <div ref={dropdownRef} className="relative px-4 py-3 border-b border-zinc-800/60">
      <button
        onClick={() => { setOpen(!open); setShowNovo(false); setEditandoId(null); }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800/60 hover:border-zinc-700/80 transition-all group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-offset-zinc-900"
            style={{ backgroundColor: corProjeto, boxShadow: `0 0 8px ${corProjeto}60` }}
          />
          <span className="text-xs font-semibold text-zinc-200 truncate">{nomeProjeto}</span>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-zinc-400 flex-shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-4 right-4 top-full mt-1.5 z-50 bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Opção "Todos" */}
          <button
            onClick={() => { setProjetoAtivo('all'); setOpen(false); }}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors',
              projetoAtivo === 'all'
                ? 'bg-indigo-600/20 text-indigo-300'
                : 'text-zinc-300 hover:bg-zinc-800'
            )}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span>Todos os Projetos</span>
            {projetoAtivo === 'all' && <Check className="w-3 h-3 ml-auto text-indigo-400" />}
          </button>

          {projetos.length > 0 && <div className="border-t border-zinc-800 mx-2" />}

          {/* Lista de projetos */}
          {projetos.map((p) => (
            <div key={p.id}>
              {editandoId === p.id ? (
                /* ── Modo edição ── */
                <div className="px-3 py-2 space-y-2 bg-zinc-800/40">
                  <input
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    placeholder="Nome do projeto"
                    autoFocus
                  />
                  <input
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-zinc-400 focus:outline-none focus:border-indigo-500"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Descrição (opcional)"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {CORES_PRESET.map((c) => (
                      <button
                        key={c}
                        onClick={() => setEditCor(c)}
                        className={cn('w-5 h-5 rounded-full transition-transform hover:scale-110', editCor === c && 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900 scale-110')}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => salvarEdicao(p.id)}
                      disabled={salvando}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium transition-colors"
                    >
                      {salvando ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="px-2 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-md text-xs transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Modo visualização ── */
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 group/item transition-colors',
                    projetoAtivo === p.id ? 'bg-zinc-800/60' : 'hover:bg-zinc-800/40'
                  )}
                >
                  <button
                    onClick={() => { setProjetoAtivo(p.id); setOpen(false); }}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.cor, boxShadow: `0 0 6px ${p.cor}50` }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-200 truncate">{p.nome}</div>
                      {p.descricao && <div className="text-[10px] text-zinc-500 truncate">{p.descricao}</div>}
                    </div>
                    {projetoAtivo === p.id && <Check className="w-3 h-3 ml-auto text-indigo-400 flex-shrink-0" />}
                  </button>
                  <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => iniciarEdicao(p)}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
                      title="Editar projeto"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    {projetos.length > 1 && (
                      <button
                        onClick={() => excluirProjeto(p.id, p.nome)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
                        title="Excluir projeto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-zinc-800 mx-2" />

          {/* Novo Projeto */}
          {showNovo ? (
            <div className="px-3 py-2 space-y-2 bg-zinc-800/20">
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Nome do projeto *"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && criarProjeto()}
              />
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-zinc-400 focus:outline-none focus:border-indigo-500"
                value={novaDesc}
                onChange={(e) => setNovaDesc(e.target.value)}
                placeholder="Descrição (opcional)"
              />
              <div className="flex gap-1 flex-wrap">
                {CORES_PRESET.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNovaCor(c)}
                    className={cn('w-5 h-5 rounded-full transition-transform hover:scale-110', novaCor === c && 'ring-2 ring-white ring-offset-1 ring-offset-zinc-900 scale-110')}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={criarProjeto}
                  disabled={salvando || !novoNome.trim()}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-md text-xs font-medium transition-colors"
                >
                  {salvando ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  Criar
                </button>
                <button
                  onClick={() => setShowNovo(false)}
                  className="px-2 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-md text-xs transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNovo(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Projeto
            </button>
          )}
        </div>
      )}
    </div>
  );
}
