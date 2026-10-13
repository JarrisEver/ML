import React from 'react';
import { Database, AlertTriangle, CheckCircle, PieChart, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import { DatasetStats } from '../types/fraud';
import { BankIllustration } from './BankIllustration';

interface ModuleResumenProps {
  stats: DatasetStats;
  isTrained: boolean;
  onExploreDataClick?: () => void;
  onTrainClick?: () => void;
}

export const ModuleResumen: React.FC<ModuleResumenProps> = ({
  stats,
  isTrained,
  onExploreDataClick,
  onTrainClick,
}) => {
  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-blue-400">
        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
          1
        </span>
        <span className="tracking-wide">Pantalla principal (Resumen general)</span>
      </div>

      {/* Hero Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Titles & Explanations */}
        <div className="lg:col-span-8 space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Sistema Inteligente de Detección de Fraudes Bancarios
          </h2>
          <div className="text-base font-semibold text-blue-400">
            Aplicación de Machine Learning supervisado mediante Random Forest
          </div>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            Analiza transacciones de tarjetas bancarias para identificar operaciones sospechosas
            de fraude utilizando el dataset público de Kaggle (ULB). Permite comprender el impacto
            crítico del desbalance de clases, calibrar umbrales de decisión y evaluar métricas sin la trampa de la exactitud (accuracy paradox).
          </p>
        </div>

        {/* Right Column: Custom Bank Security Vector */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-800/40 to-slate-900 border border-blue-500/20 shadow-inner">
            <BankIllustration className="w-64 h-36" />
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {/* Card 1: Total */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">Transacciones en total</span>
            <Database className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">2 días de operaciones bancarias</div>
        </div>

        {/* Card 2: Fraudes */}
        <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold text-rose-300/80">Transacciones fraudulentas</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono tabular-nums">
            {stats.fraudCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">Clase minoritaria crítica (Class = 1)</div>
        </div>

        {/* Card 3: Legítimas */}
        <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold text-emerald-300/80">Transacciones legítimas</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {stats.legitimateCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Clase mayoritaria normal (Class = 0)</div>
        </div>

        {/* Card 4: Porcentaje */}
        <div className="bg-sky-950/30 border border-sky-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between text-sky-400 mb-2">
            <span className="text-xs font-semibold text-sky-300/80">Porcentaje de fraude</span>
            <PieChart className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-sky-300 font-mono tabular-nums">
            {stats.fraudPercentage}%
          </div>
          <div className="text-[11px] text-sky-400/80 mt-1">Desbalance extremo (~0.172%)</div>
        </div>
      </div>

      {/* Bottom Dataset Attribution Banner */}
      <div className="mt-5 pt-4 border-t border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Dataset: </span>
            <span>Credit Card Fraud Detection (ULB) - Kaggle. </span>
            <span className="text-slate-400">
              Registros de transacciones europeas en dos días. 28 variables anonimizadas (V1-V28), Time, Amount y Class.
            </span>{' '}
            <a
              href="https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 font-medium ml-1"
            >
              Ver fuente en Kaggle <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Model State Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-300 font-medium text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Modelo: Random Forest</span>
          </div>
          <div
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 ${
              isTrained
                ? 'bg-emerald-950/90 border border-emerald-700/60 text-emerald-300'
                : 'bg-amber-950/90 border border-amber-700/60 text-amber-300'
            }`}
          >
            <span>{isTrained ? '✓ Entrenado' : '● Modo Demostración / Benchmark'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
