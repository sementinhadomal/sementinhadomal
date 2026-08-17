'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { CredencialModal } from '@/components/modals/CredencialModal';
import { useProject } from '@/lib/project-context';
import {
  KeyRound,
  Plus,
  Search,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Edit2,
  Trash2,
  ShieldCheck,
  Lock,
  User,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CredenciaisPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Estados locais de exibição de senha por ID
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  // Estados de feedback de cópia por campo ("login-id" ou "senha-id")
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { projetoAtivo, projetos } = useProject();

  const fetchCredenciais = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/credenciais?search=${encodeURIComponent(search)}&projetoId=${projetoAtivo}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error('Error fetching credenciais:', err);
    } finally {
      setLoading(false);
    }
  }, [search, projetoAtivo]);

  useEffect(() => {
    fetchCredenciais();
  }, [fetchCredenciais]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async (formData: any) => {
    const dataWithProject = {
      ...formData,
      projetoId: formData.projetoId || (projetoAtivo !== 'all' ? projetoAtivo : projetos[0]?.id),
    };

    if (selectedItem) {
      await fetch(`/api/credenciais/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithProject),
      });
    } else {
      await fetch('/api/credenciais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithProject),
      });
    }
    fetchCredenciais();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/credenciais/${id}`, { method: 'DELETE' });
    fetchCredenciais();
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Logins & Senhas"
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="p-4 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Banner Topo */}
        <div className="glass-card rounded-xl p-5 border border-zinc-800/80 bg-gradient-to-r from-zinc-900 via-indigo-950/20 to-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                Cofrinho de Acessos
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Guarde e organize seus e-mails, senhas e links de acesso com total segurança.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedItem(null);
              setModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Novo Login / Senha
          </button>
        </div>

        {/* Lista de Credenciais (Grid de Cards) */}
        {loading ? (
          <div className="py-12 text-center text-zinc-500 text-xs">Carregando acessos salvos...</div>
        ) : data.length === 0 ? (
          <div className="glass-card rounded-xl p-8 border border-zinc-800/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">Nenhum login cadastrado</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Adicione suas senhas de plataformas como Shopify, Meta Ads, Hotmart ou E-mails para nunca mais esquecer.
            </p>
            <button
              onClick={() => {
                setSelectedItem(null);
                setModalOpen(true);
              }}
              className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Primeiro Acesso
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => {
              const isVisible = showPasswords[item.id] || false;
              const loginCopyKey = `login-${item.id}`;
              const passCopyKey = `pass-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-4 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-4 group"
                  style={{ borderLeftColor: item.projetoCor, borderLeftWidth: 3 }}
                >
                  {/* Topo do Card: Serviço + Projeto + Ações */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-zinc-100 truncate">{item.servico}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.projetoCor }}
                        />
                        <span className="text-[11px] text-zinc-400 font-medium truncate">{item.projetoNome}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {item.url && (
                        <a
                          href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded transition-colors"
                          title="Abrir site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setModalOpen(true);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Usuário / E-mail */}
                  <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                        <User className="w-3 h-3 text-zinc-400" />
                        Usuário / E-mail
                      </span>
                      <button
                        onClick={() => handleCopy(item.login, loginCopyKey)}
                        className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        {copiedKey === loginCopyKey ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-mono text-zinc-200 select-all break-all">{item.login}</p>
                  </div>

                  {/* Senha */}
                  <div className="bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3 text-zinc-400" />
                        Senha
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleShowPassword(item.id)}
                          className="text-zinc-400 hover:text-zinc-200 transition-colors p-0.5"
                          title={isVisible ? 'Ocultar senha' : 'Exibir senha'}
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleCopy(item.senha, passCopyKey)}
                          className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                          {copiedKey === passCopyKey ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copiada!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-mono text-zinc-200 select-all tracking-wider">
                      {isVisible ? item.senha : '••••••••••••'}
                    </p>
                  </div>

                  {/* Observação / Anotação se houver */}
                  {item.observacao && (
                    <div className="text-[11px] text-zinc-400 italic bg-zinc-900/40 p-2 rounded border border-zinc-800/40">
                      {item.observacao}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de cadastro/edição */}
      <CredencialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={selectedItem}
        projetos={projetos}
        projetoAtivoId={projetoAtivo !== 'all' ? projetoAtivo : projetos[0]?.id}
      />

      {/* Modal de confirmação de exclusão */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-100">Confirmar Exclusão</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Tem certeza que deseja apagar essa senha salva?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
