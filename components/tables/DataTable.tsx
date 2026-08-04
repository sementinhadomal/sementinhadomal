'use client';

import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Copy,
  Plus,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Tag,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DataTableProps {
  data: any[];
  type: 'receita' | 'custo';
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DataTable({
  data,
  type,
  onAdd,
  onEdit,
  onDuplicate,
  onDelete,
}: DataTableProps) {
  const [sortField, setSortField] = useState<string>('data');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'data') {
      valA = new Date(a.data).getTime();
      valB = new Date(b.data).getTime();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="glass-card rounded-xl border border-zinc-800/80 overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-200 capitalize flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${type === 'receita' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          {type === 'receita' ? 'Lista de Faturamentos' : 'Lista de Custos'}
          <span className="text-xs text-zinc-500 font-normal">({data.length} registros)</span>
        </h3>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo {type === 'receita' ? 'Faturamento' : 'Custo'}
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800/80 uppercase font-semibold text-[11px] tracking-wider">
            <tr>
              <th
                onClick={() => handleSort('nome')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Nome
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('categoria')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Categoria
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('valor')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Valor Original
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('valorConvertido')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Total (BRL)
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('data')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Data
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Observação</th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/60 transition-colors group">
                  <td className="py-3 px-4 font-semibold text-zinc-100 flex items-center gap-2">
                    {item.nome}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {item.moeda === 'USD' ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-amber-400">
                          USD ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          Cotação: {item.cotacao}
                        </span>
                      </div>
                    ) : (
                      <span>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    <span className={item.valorConvertido < 0 ? 'text-rose-400' : type === 'receita' ? 'text-emerald-400' : 'text-zinc-200'}>
                      R$ {item.valorConvertido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{formatDate(item.data)}</td>
                  <td className="py-3 px-4 text-zinc-500 italic max-w-xs truncate">
                    {item.observacao || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onDuplicate(item.id)}
                        title="Duplicar"
                        className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        title="Editar"
                        className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Excluir"
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      <div className="p-3 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:bg-zinc-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:bg-zinc-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full max-w-md shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-100">Confirmar Exclusão</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Tem certeza que deseja excluir este registro? Essa ação atualizará todos os totais em tempo real.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/20"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
