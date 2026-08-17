'use client';

import React, { useEffect, useState } from 'react';
import { X, KeyRound, Eye, EyeOff, FolderOpen, Globe, User, ShieldCheck } from 'lucide-react';

interface Projeto {
  id: string;
  nome: string;
  cor: string;
}

interface CredencialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
  projetos?: Projeto[];
  projetoAtivoId?: string;
}

export function CredencialModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  projetos = [],
  projetoAtivoId,
}: CredencialModalProps) {
  const [servico, setServico] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [url, setUrl] = useState('');
  const [observacao, setObservacao] = useState('');
  const [projetoId, setProjetoId] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setServico(initialData.servico || '');
      setLogin(initialData.login || '');
      setSenha(initialData.senha || '');
      setUrl(initialData.url || '');
      setObservacao(initialData.observacao || '');
      setProjetoId(initialData.projetoId || projetoAtivoId || projetos[0]?.id || '');
    } else {
      setServico('');
      setLogin('');
      setSenha('');
      setUrl('');
      setObservacao('');
      setProjetoId(projetoAtivoId || projetos[0]?.id || '');
    }
    setShowPassword(false);
  }, [initialData, isOpen, projetoAtivoId, projetos]);

  if (!isOpen) return null;

  const projetoSelecionado = projetos.find((p) => p.id === projetoId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!servico.trim() || !login.trim() || !senha.trim()) return;
    setLoading(true);
    try {
      await onSave({
        servico: servico.trim(),
        login: login.trim(),
        senha: senha.trim(),
        url: url.trim(),
        observacao: observacao.trim(),
        projetoId,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            {initialData ? 'Editar Acesso / Credencial' : 'Novo Registro de Login'}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Seletor de Projeto */}
          {projetos.length > 1 && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
                Vincular ao Projeto
              </label>
              <select
                value={projetoId}
                onChange={(e) => setProjetoId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                {projetos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Nome do Serviço */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              Serviço / Plataforma *
            </label>
            <input
              type="text"
              required
              value={servico}
              onChange={(e) => setServico(e.target.value)}
              placeholder="Ex: Shopify Admin, Meta BM, Hotmart, E-mail..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Login e Senha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                Usuário / E-mail *
              </label>
              <input
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Ex: admin@minhaloja.com"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Senha *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-3.5 pr-10 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* URL da página de login */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              Link / URL do Site (opcional)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Ex: https://admin.shopify.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Anotações / Lembretes (opcional)</label>
            <textarea
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Código 2FA anotado no celular, recuperação via e-mail secundário..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !servico.trim() || !login.trim() || !senha.trim()}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Acesso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
