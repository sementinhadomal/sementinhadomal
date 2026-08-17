'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DataTable } from '@/components/tables/DataTable';
import { ItemModal } from '@/components/modals/ItemModal';
import { useData } from '@/lib/data-context';

export default function FaturamentosPage() {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { receitas, projetos, projetoAtivo, addReceita, updateReceita, deleteReceita, duplicateReceita } = useData();

  const now = new Date();
  let fromDate: Date | null = null;
  if (period === 'today') fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  else if (period === 'week') { fromDate = new Date(now); fromDate.setDate(now.getDate() - now.getDay()); fromDate.setHours(0,0,0,0); }
  else if (period === 'month') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (period === 'year') fromDate = new Date(now.getFullYear(), 0, 1);

  let filtered = projetoAtivo === 'all' ? [...receitas] : receitas.filter((r) => r.projetoId === projetoAtivo);
  if (fromDate) filtered = filtered.filter((r) => new Date(r.data) >= fromDate!);
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (r) =>
        r.nome.toLowerCase().includes(q) ||
        r.categoria.toLowerCase().includes(q) ||
        (r.observacao || '').toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const dataWithProjects = filtered.map((r) => {
    const p = projetos.find((proj) => proj.id === r.projetoId);
    return { ...r, projetoNome: p?.nome || 'Sem projeto', projetoCor: p?.cor || '#6366f1' };
  });

  const handleSave = async (formData: any) => {
    const dataWithProject = {
      ...formData,
      projetoId: formData.projetoId || (projetoAtivo !== 'all' ? projetoAtivo : projetos[0]?.id),
    };

    if (selectedItem) {
      await updateReceita(selectedItem.id, dataWithProject);
    } else {
      await addReceita(dataWithProject);
    }
  };

  const handleDuplicate = async (id: string) => {
    await duplicateReceita(id);
  };

  const handleDelete = async (id: string) => {
    await deleteReceita(id);
  };

  const totalFaturamento = dataWithProjects.reduce((acc, r) => acc + r.valorConvertido, 0);

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header
        title="Faturamentos"
        selectedPeriod={period}
        onPeriodChange={setPeriod}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="p-4 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Banner Total */}
        <div className="glass-card rounded-xl p-5 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
              Total em Faturamentos (Filtrado)
            </span>
            <h2 className="text-2xl font-bold text-emerald-400 mt-1">
              R$ {totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {dataWithProjects.length} registro(s) encontrado(s)
            </p>
          </div>
          <button
            onClick={() => { setSelectedItem(null); setModalOpen(true); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            + Novo Faturamento
          </button>
        </div>

        <DataTable
          data={dataWithProjects}
          type="receita"
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
        type="receita"
        projetos={projetos}
        projetoAtivoId={projetoAtivo !== 'all' ? projetoAtivo : projetos[0]?.id}
      />
    </div>
  );
}
