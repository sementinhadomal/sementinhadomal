'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { DataTable } from '@/components/tables/DataTable';
import { ItemModal } from '@/components/modals/ItemModal';
import { useProject } from '@/lib/project-context';

export default function CustosPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { projetoAtivo, projetos } = useProject();

  const fetchCustos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/custos?search=${encodeURIComponent(search)}&period=${period}&projetoId=${projetoAtivo}`
      );
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error('Error fetching custos:', err);
    } finally {
      setLoading(false);
    }
  }, [search, period, projetoAtivo]);

  useEffect(() => {
    fetchCustos();
  }, [fetchCustos]);

  const handleSave = async (formData: any) => {
    const dataWithProject = {
      ...formData,
      projetoId: formData.projetoId || (projetoAtivo !== 'all' ? projetoAtivo : projetos[0]?.id),
    };

    if (selectedItem) {
      await fetch(`/api/custos/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithProject),
      });
    } else {
      await fetch('/api/custos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithProject),
      });
    }
    fetchCustos();
  };

  const handleDuplicate = async (id: string) => {
    await fetch(`/api/custos/${id}`, { method: 'POST' });
    fetchCustos();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/custos/${id}`, { method: 'DELETE' });
    fetchCustos();
  };

  const totalCustos = data.reduce((acc, c) => acc + c.valorConvertido, 0);

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Custos & Despesas"
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Banner Total */}
        <div className="glass-card rounded-xl p-5 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Total em Custos (Filtrado)
            </span>
            <h2 className="text-2xl font-bold text-rose-400 mt-1">
              R$ {totalCustos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {data.length} registro(s) encontrado(s)
            </p>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setModalOpen(true); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            + Novo Custo
          </button>
        </div>

        <DataTable
          data={data}
          type="custo"
          onAdd={() => { setSelectedItem(null); setModalOpen(true); }}
          onEdit={(item) => { setSelectedItem(item); setModalOpen(true); }}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>

      <ItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={selectedItem}
        type="custo"
        projetos={projetos}
        projetoAtivoId={projetoAtivo !== 'all' ? projetoAtivo : projetos[0]?.id}
      />
    </div>
  );
}
