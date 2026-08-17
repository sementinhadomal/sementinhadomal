'use client';

import React, { useEffect, useState } from 'react';
import { X, RefreshCw, FolderOpen } from 'lucide-react';

interface Projeto {
  id: string;
  nome: string;
  cor: string;
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
  type: 'receita' | 'custo';
  projetos?: Projeto[];
  projetoAtivoId?: string;
}

export function ItemModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  type,
  projetos = [],
  projetoAtivoId,
}: ItemModalProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');
  const [moeda, setMoeda] = useState('BRL');
  const [cotacao, setCotacao] = useState('5.39');
  const [observacao, setObservacao] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [projetoId, setProjetoId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '');
      setCategoria(initialData.categoria || '');
      setValor(initialData.valor !== undefined ? String(initialData.valor) : '');
      setMoeda(initialData.moeda || 'BRL');
      setCotacao(initialData.cotacao ? String(initialData.cotacao) : '5.39');
      setObservacao(initialData.observacao || '');
      setProjetoId(initialData.projetoId || projetoAtivoId || projetos[0]?.id || '');
      if (initialData.data) {
        setData(new Date(initialData.data).toISOString().split('T')[0]);
      }
    } else {
      setNome('');
      setCategoria(type === 'receita' ? 'Lançamento' : 'Tráfego Pago');
      setValor('');
      setMoeda('BRL');
      setCotacao('5.39');
      setObservacao('');
      setData(new Date().toISOString().split('T')[0]);
      setProjetoId(projetoAtivoId || projetos[0]?.id || '');
    }
  }, [initialData, isOpen, type, projetoAtivoId, projetos]);

  if (!isOpen) return null;

  const numValor = parseFloat(valor) || 0;
  const numCotacao = parseFloat(cotacao) || 0;
  const valorConvertido = moeda === 'USD' ? numValor * numCotacao : numValor;

  const projetoSelecionado = projetos.find((p) => p.id === projetoId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        nome,
        categoria,
        valor: numValor,
        moeda,
        cotacao: moeda === 'USD' ? numCotacao : null,
        observacao,
        data,
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
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${type === 'receita' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {initialData
              ? `Editar ${type === 'receita' ? 'Faturamento' : 'Custo'}`
              : `Novo ${type === 'receita' ? 'Faturamento' : 'Custo'}`}
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Projeto */}
          {projetos.length > 1 && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
                Projeto
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
              {projetoSelecionado && (
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: projetoSelecionado.cor }} />
                  <span className="text-[11px] text-zinc-500">{projetoSelecionado.nome}</span>
                </div>
              )}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder={type === 'receita' ? 'Ex: Oferta 1, Mentoria VIP...' : 'Ex: Meta Ads, ClickFunnels...'}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Categoria</label>
              <input
                type="text"
                required
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex: Lançamento, Tráfego..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Data</label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Moeda</label>
              <select
                value={moeda}
                onChange={(e) => setMoeda(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="BRL">BRL (R$)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                {moeda === 'USD' ? 'Valor (USD)' : 'Valor (BRL)'}
              </label>
              <input
                type="number"
                step="any"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            {moeda === 'USD' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Cotação</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={cotacao}
                  onChange={(e) => setCotacao(e.target.value)}
                  placeholder="5.39"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Conversão em tempo real */}
          <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              Valor Final Convertido (BRL):
            </span>
            <span className={`font-bold text-sm ${valorConvertido < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              R$ {valorConvertido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Observação</label>
            <textarea
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Notas adicionais, taxas, observações..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

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
              disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
