'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DataTable } from '@/components/tables/DataTable';
import { ItemModal } from '@/components/modals/ItemModal';

export default function FaturamentosPage() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchReceitas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/receitas?search=${encodeURIComponent(search)}&period=${period}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching receitas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, [search, period]);

  const handleSave = async (formData: any) => {
    if (selectedItem) {
      // Edit
      await fetch(`/api/receitas/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } else {
      // Create
      await fetch('/api/receitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    }
    fetchReceitas();
  };

  const handleDuplicate = async (id: string) => {
    await fetch(`/api/receitas/${id}`, { method: 'POST' });
    fetchReceitas();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/receitas/${id}`, { method: 'DELETE' });
    fetchReceitas();
  };

  const totalFaturamento = data.reduce((acc, r) => acc + r.valorConvertido, 0);

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Faturamentos"
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Banner Total Faturamento */}
        <div className="glass-card rounded-xl p-5 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Total em Faturamentos (Filtrado)
            </span>
            <h2 className="text-2xl font-bold text-emerald-400 mt-1">
              R$ {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedItem(null);
              setModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            + Novo Faturamento
          </button>
        </div>

        {/* Table */}
        <DataTable
          data={data}
          type="receita"
          onAdd={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
          onEdit={(item) => {
            setSelectedItem(item);
            setModalOpen(true);
          }}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>

      <ItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={selectedItem}
        type="receita"
      />
    </div>
  );
}
