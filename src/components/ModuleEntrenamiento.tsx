import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, Sliders, ShieldCheck, RefreshCw, Zap } from 'lucide-react';
import { TrainingConfig, EvaluationMetrics } from '../types/fraud';

interface ModuleEntrenamientoProps {
  config: TrainingConfig;
  onConfigChange: (newConfig: Partial<TrainingConfig>) => void;
  onThresholdChange: (newThreshold: number) => void;
  onTrainModel: () => Promise<void>;
  isTraining: boolean;
  trainingStep: number;
  trainingMessage: string;
  metrics: EvaluationMetrics | null;
}

export const ModuleEntrenamiento: React.FC<ModuleEntrenamientoProps> = ({
  config,
  onConfigChange,
  onThresholdChange,
  onTrainModel,
  isTraining,
  trainingStep,
  trainingMessage,
  metrics,
}) => {
  const stepsList = [
    'Cargando y validando transacciones...',
    'Preprocesando variables (Normalización)...',
    'Dividiendo entrenamiento y prueba de forma estratificada...',
    'Entrenando ensamble Random Forest (Bagging y árboles)...',
    'Evaluando modelo en datos de prueba no vistos...',
  ];

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
          3
        </span>
        <span className="text-base text-white font-bold tracking-tight">
          Entrenamiento del modelo
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuración del entrenamiento (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/90 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Configuración del entrenamiento</span>
          </h3>

          {/* Selector de Algoritmo */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Algoritmo</label>
            <select
              disabled={isTraining}
              value={config.algorithm}
              onChange={(e) => onConfigChange({ algorithm: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="random_forest">Random Forest Classifier (Ensamble de 100 árboles)</option>
            </select>
          </div>

          {/* División de datos */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">División de datos</label>
            <select
              disabled={isTraining}
              value={config.testSplitRatio}
              onChange={(e) => onConfigChange({ testSplitRatio: parseFloat(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0.20}>80% entrenamiento - 20% prueba (Estratificado)</option>
              <option value={0.30}>70% entrenamiento - 30% prueba (Estratificado)</option>
            </select>
          </div>

          {/* Manejo de desbalance */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Manejo de desbalance</label>
            <select
              disabled={isTraining}
              value={config.imbalanceStrategy}
              onChange={(e) => onConfigChange({ imbalanceStrategy: e.target.value as any })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="class_weight_balanced">class_weight = &apos;balanced&apos; (Ponderación inversa por clase)</option>
              <option value="undersampling">Submuestreo aleatorio (Random Undersampling)</option>
              <option value="none">Sin balancear (Desbalance natural 0.17%)</option>
            </select>
          </div>

          {/* Umbral de clasificación interactivo */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Umbral de clasificación (τ)
              </label>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 tabular-nums">
                {config.threshold.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={config.threshold}
              onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.05 (Alta Sensibilidad / Más alarmas)</span>
              <span>0.50 (Estándar)</span>
              <span>0.95 (Alta Precisión)</span>
            </div>
          </div>

          {/* Botón Entrenar */}
          <button
            onClick={onTrainModel}
            disabled={isTraining}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
          >
            {isTraining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Entrenando modelo en progreso...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Entrenar modelo</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Progreso y Resumen del entrenamiento (col-span-7) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Progreso */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Progreso de ejecución</span>
            </h4>
            <div className="space-y-2">
              {stepsList.map((stepText, idx) => {
                const stepNum = idx + 1;
                const isFinished = !isTraining || trainingStep > stepNum;
                const isCurrent = isTraining && trainingStep === stepNum;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                        {stepNum}
                      </div>
                    )}
                    <span
                      className={`${
                        isCurrent
                          ? 'text-white font-semibold'
                          : isFinished
                          ? 'text-slate-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen del entrenamiento */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Resumen del entrenamiento</span>
            </h4>

            <div className="grid grid-cols-2 gap-y-2 text-slate-300 font-mono text-[11px] border-b border-slate-800/80 pb-3">
              <div className="text-slate-400">Registros de entrenamiento:</div>
              <div className="text-right text-white font-bold tabular-nums">
                {metrics?.trainTotalCount.toLocaleString() ?? '227,846'}
              </div>

              <div className="text-slate-400">Registros de prueba (Test set):</div>
              <div className="text-right text-white font-bold tabular-nums">
                {metrics?.testTotalCount.toLocaleString() ?? '56,961'}
              </div>

              <div className="text-slate-400">Fraudes en entrenamiento:</div>
              <div className="text-right text-rose-400 font-bold tabular-nums">
                {metrics?.trainFraudCount ?? 393}
              </div>

              <div className="text-slate-400">Fraudes en prueba:</div>
              <div className="text-right text-rose-400 font-bold tabular-nums">
                {metrics?.testFraudCount ?? 99}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="text-slate-400">Parámetros principales:</span>
              <span className="font-mono text-slate-300">
                n_estimators = 100 · max_depth = None · class_weight = &apos;balanced&apos;
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
