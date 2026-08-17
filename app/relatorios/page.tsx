'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { DashboardCharts } from '@/components/dashboard/Charts';
import { useData } from '@/lib/data-context';
import { FileSpreadsheet, FileText, FileCode } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function RelatoriosPage() {
  const [period, setPeriod] = useState('all');
  const { receitas, custos, projetoAtivo, getDashboardData } = useData();

  const dashboardData = getDashboardData(period, projetoAtivo);

  const now = new Date();
  let fromDate: Date | null = null;
  if (period === 'today') fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  else if (period === 'week') { fromDate = new Date(now); fromDate.setDate(now.getDate() - now.getDay()); fromDate.setHours(0,0,0,0); }
  else if (period === 'month') fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  else if (period === 'year') fromDate = new Date(now.getFullYear(), 0, 1);

  let filteredRec = projetoAtivo === 'all' ? [...receitas] : receitas.filter((r) => r.projetoId === projetoAtivo);
  let filteredCus = projetoAtivo === 'all' ? [...custos] : custos.filter((c) => c.projetoId === projetoAtivo);

  if (fromDate) {
    filteredRec = filteredRec.filter((r) => new Date(r.data) >= fromDate!);
    filteredCus = filteredCus.filter((c) => new Date(c.data) >= fromDate!);
  }

  // Export to Excel
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    const recData = filteredRec.map((r) => ({
      Nome: r.nome,
      Categoria: r.categoria,
      ValorOriginal: r.valor,
      Moeda: r.moeda,
      Cotacao: r.cotacao || 1,
      TotalBRL: r.valorConvertido,
      Data: new Date(r.data).toLocaleDateString('pt-BR'),
      Observacao: r.observacao || '',
    }));

    const cusData = filteredCus.map((c) => ({
      Nome: c.nome,
      Categoria: c.categoria,
      ValorOriginal: c.valor,
      Moeda: c.moeda,
      Cotacao: c.cotacao || 1,
      TotalBRL: c.valorConvertido,
      Data: new Date(c.data).toLocaleDateString('pt-BR'),
      Observacao: c.observacao || '',
    }));

    const wsRec = XLSX.utils.json_to_sheet(recData);
    const wsCus = XLSX.utils.json_to_sheet(cusData);

    XLSX.utils.book_append_sheet(wb, wsRec, 'Faturamentos');
    XLSX.utils.book_append_sheet(wb, wsCus, 'Custos');

    XLSX.writeFile(wb, `SementinhaDoMal_Relatorio_${period}.xlsx`);
  };

  // Export to CSV
  const exportCSV = () => {
    const allData = [
      ...filteredRec.map((r) => ({ Tipo: 'Faturamento', ...r })),
      ...filteredCus.map((c) => ({ Tipo: 'Custo', ...c })),
    ];
    const ws = XLSX.utils.json_to_sheet(allData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SementinhaDoMal_Relatorio_${period}.csv`;
    a.click();
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Sementinha do Mal - Relatório Financeiro', 14, 20);
    doc.setFontSize(10);
    doc.text(`Período: ${period.toUpperCase()} | Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);

    doc.text('Faturamentos:', 14, 38);
    autoTable(doc, {
      startY: 42,
      head: [['Nome', 'Categoria', 'Moeda', 'Total (BRL)', 'Data']],
      body: filteredRec.map((r) => [
        r.nome,
        r.categoria,
        r.moeda,
        `R$ ${r.valorConvertido.toFixed(2)}`,
        new Date(r.data).toLocaleDateString('pt-BR'),
      ]),
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.text('Custos:', 14, finalY);
    autoTable(doc, {
      startY: finalY + 4,
      head: [['Nome', 'Categoria', 'Moeda', 'Total (BRL)', 'Data']],
      body: filteredCus.map((c) => [
        c.nome,
        c.categoria,
        c.moeda,
        `R$ ${c.valorConvertido.toFixed(2)}`,
        new Date(c.data).toLocaleDateString('pt-BR'),
      ]),
    });

    doc.save(`SementinhaDoMal_Relatorio_${period}.pdf`);
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header title="Relatórios & Exportação" selectedPeriod={period} onPeriodChange={setPeriod} />

      <div className="p-4 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Export Action Card */}
        <div className="glass-card rounded-xl p-5 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-zinc-100">Exportar Dados Operacionais</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Baixe seus relatórios financeiros completos nos formatos Excel, CSV ou PDF.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={exportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel (.xlsx)
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all"
            >
              <FileCode className="w-4 h-4" />
              CSV
            </button>

            <button
              onClick={exportPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition-all"
            >
              <FileText className="w-4 h-4" />
              PDF Document
            </button>
          </div>
        </div>

        {/* Professional Charts */}
        <DashboardCharts
          monthlyBreakdown={dashboardData?.monthlyBreakdown || []}
          pieReceitas={dashboardData?.pieReceitas || []}
          pieCustos={dashboardData?.pieCustos || []}
        />
      </div>
    </div>
  );
}
