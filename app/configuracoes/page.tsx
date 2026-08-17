'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Settings as SettingsIcon, Download, Upload, Save, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { useData } from '@/lib/data-context';

export default function ConfiguracoesPage() {
  const [nomeSistema, setNomeSistema] = useState('Sementinha do Mal');
  const [moedaPadrao, setMoedaPadrao] = useState('BRL');
  const [cotacaoDolar, setCotacaoDolar] = useState('5.39');
  const [tema, setTema] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  const { exportBackupJSON, importBackupJSON, resetToDefaults } = useData();

  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setSavedMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download Backup
  const handleBackup = () => {
    try {
      const json = exportBackupJSON();
      const blob = new Blob([json], { type: 'application/json' });
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
    reader.onload = (event) => {
      try {
        const jsonStr = event.target?.result as string;
        const ok = importBackupJSON(jsonStr);
        if (ok) {
          alert('Backup restaurado com sucesso!');
        } else {
          alert('Erro ao restaurar backup. Verifique se o arquivo é um JSON válido.');
        }
      } catch (err) {
        console.error(err);
        alert('Arquivo de backup inválido.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setShowResetModal(false);
    alert('Dados restaurados para o padrão do Projeto 1.');
  };

  return (
    <div className="flex-1 flex flex-col pb-12">
      <Header title="Configurações do Sistema" />

      <div className="p-4 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Settings Form */}
        <div className="glass-card rounded-xl p-6 border border-zinc-800/80">
          <h2 className="text-base font-bold text-zinc-100 mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-indigo-400" />
            Parâmetros Gerais
          </h2>

          <form onSubmit={handleSaveConfigs} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            Faça um backup completo dos seus dados para salvar em arquivo JSON ou restaurar em outro dispositivo.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={handleBackup}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold border border-zinc-700 transition-colors"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              Fazer Backup em Arquivo (.json)
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg text-xs font-semibold border border-zinc-700 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              Restaurar Arquivo de Backup
              <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
            </label>

            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800/50 transition-colors ml-auto"
            >
              <RefreshCw className="w-4 h-4 text-rose-400" />
              Restaurar Dados Iniciais
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação de reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 w-full max-w-sm shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-100">Restaurar Padrões?</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Essa ação substituirá os dados salvos pelos valores padrões iniciais. Recomendamos fazer um backup antes.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/20"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
