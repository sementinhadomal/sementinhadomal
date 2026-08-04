'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Settings as SettingsIcon, Download, Upload, History, Save, CheckCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function ConfiguracoesPage() {
  const [nomeSistema, setNomeSistema] = useState('Sementinha do Mal');
  const [moedaPadrao, setMoedaPadrao] = useState('BRL');
  const [cotacaoDolar, setCotacaoDolar] = useState('5.39');
  const [tema, setTema] = useState('dark');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/configuracoes');
      const data = await res.json();
      if (data.nomeSistema) setNomeSistema(data.nomeSistema);
      if (data.moedaPadrao) setMoedaPadrao(data.moedaPadrao);
      if (data.cotacaoDolar) setCotacaoDolar(data.cotacaoDolar);
      if (data.tema) setTema(data.tema);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/historico');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfigs();
    fetchHistory();
  }, []);

  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configs: { nomeSistema, moedaPadrao, cotacaoDolar, tema },
        }),
      });
      setSavedMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download Backup
  const handleBackup = async () => {
    try {
      const res = await fetch('/api/configuracoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'backup' }),
      });
      const data = await res.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SementinhaDoMal_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  // Restore Backup
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backupData = JSON.parse(event.target?.result as string);
        const res = await fetch('/api/configuracoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'restore', backupData }),
        });
        const result = await res.json();
        if (result.success) {
          alert('Backup restaurado com sucesso! A página será atualizada.');
          window.location.reload();
        } else {
          alert(result.error || 'Erro ao restaurar backup.');
        }
      } catch (err) {
        console.error(err);
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header title="Configurações do Sistema" />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Settings Form */}
        <div className="glass-card rounded-xl p-6 border border-zinc-800/80">
          <h2 className="text-base font-bold text-zinc-100 mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-400" />
            Parâmetros Gerais
          </h2>

          <form onSubmit={handleSaveConfigs} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nome do Sistema
                </label>
                <input
                  type="text"
                  value={nomeSistema}
                  onChange={(e) => setNomeSistema(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Moeda Padrão
                </label>
                <select
                  value={moedaPadrao}
                  onChange={(e) => setMoedaPadrao(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Cotação Padrão do Dólar (USD)
                </label>
                <input
                  type="number"
                  step="any"
                  value={cotacaoDolar}
                  onChange={(e) => setCotacaoDolar(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tema da Interface
                </label>
                <select
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="dark">Tema Dark Premium (Default)</option>
                  <option value="light">Tema Light</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              {savedMessage && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {savedMessage}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Backup & Restore */}
        <div className="glass-card rounded-xl p-6 border border-zinc-800/80">
          <h2 className="text-base font-bold text-zinc-100 mb-2">Backup & Restauração de Dados</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Faça um backup completo do seu banco de dados ou restaure um arquivo previamente salvo.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleBackup}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold border border-zinc-700 transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              Fazer Backup Agora
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold border border-zinc-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              Restaurar Backup
              <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
            </label>
          </div>
        </div>

        {/* Historico Completo */}
        <div className="glass-card rounded-xl p-6 border border-zinc-800/80">
          <h2 className="text-base font-bold text-zinc-100 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Histórico Completo de Alterações
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Data / Hora</th>
                  <th className="py-2.5 px-3">Tabela</th>
                  <th className="py-2.5 px-3">Ação</th>
                  <th className="py-2.5 px-3">Valor Anterior</th>
                  <th className="py-2.5 px-3">Novo Valor</th>
                  <th className="py-2.5 px-3">Usuário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-zinc-500">
                      Nenhuma alteração registrada ainda.
                    </td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h.id} className="hover:bg-zinc-900/40">
                      <td className="py-2.5 px-3 text-zinc-400">{formatDateTime(h.createdAt)}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-indigo-300">{h.tabela}</td>
                      <td className="py-2.5 px-3 font-semibold">{h.campo}</td>
                      <td className="py-2.5 px-3 text-zinc-400 max-w-xs truncate">
                        {h.valorAnterior || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-medium max-w-xs truncate">
                        {h.novoValor || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400">{h.usuario}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
