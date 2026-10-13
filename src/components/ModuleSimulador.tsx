import React, { useState } from 'react';
import {
  Sliders,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Transaction, SimulationResult } from '../types/fraud';
import { SIMULATOR_PRESETS, PresetTransaction } from '../data/kaggleBenchmark';
import { mlEngine } from '../ml/randomForestEngine';

interface ModuleSimuladorProps {
  threshold: number;
}

export const ModuleSimulador: React.FC<ModuleSimuladorProps> = ({ threshold }) => {
  // Preset inicial: Fraude clásico
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset_fraud_night_quick');

  const [transactionData, setTransactionData] = useState<Transaction>({
    ...SIMULATOR_PRESETS[1].data,
    Time: 406,
    Amount: 150.0,
  });

  const [showAllVariables, setShowAllVariables] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<SimulationResult>(() =>
    mlEngine.predictTransaction({
      ...SIMULATOR_PRESETS[1].data,
      Time: 406,
      Amount: 150.0,
    })
  );

  // Manejador de cambio de presets
  const handleSelectPreset = (preset: PresetTransaction) => {
    setSelectedPresetId(preset.id);
    const updatedTx = { ...preset.data };
    setTransactionData(updatedTx);
    const result = mlEngine.predictTransaction(updatedTx);
    setPrediction(result);
  };

  // Manejador de cambio de campo
  const handleFieldChange = (key: keyof Transaction, value: number) => {
    const updated = { ...transactionData, [key]: value };
    setTransactionData(updated);
  };

  // Analizar transacción
  const handleAnalyze = () => {
    const result = mlEngine.predictTransaction(transactionData);
    setPrediction(result);
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
            5
          </span>
          <span className="text-base text-white font-bold tracking-tight">
            Simulador de transacciones
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Umbral de decisión del modelo: <strong className="text-white font-mono">{(threshold * 100).toFixed(0)}%</strong>
        </div>
      </div>

      {/* Preset selector bar */}
      <div className="space-y-1.5">
        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Cargar casos de prueba rápidos (Presets):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SIMULATOR_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? preset.type === 'fraud'
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40 font-semibold'
                      : preset.type === 'legitimate'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40 font-semibold'
                      : 'bg-amber-600 text-white shadow-sm shadow-amber-900/40 font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Formulario (col-span-6) */}
        <div className="lg:col-span-6 bg-slate-950/60 border border-slate-800/90 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800/80 pb-2">
            Ingresar datos de una transacción
          </h3>

          {/* Time & Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Time (segundos)</label>
              <input
                type="number"
                value={transactionData.Time}
                onChange={(e) => handleFieldChange('Time', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Amount (euros €)</label>
              <input
                type="number"
                step="0.01"
                value={transactionData.Amount}
                onChange={(e) => handleFieldChange('Amount', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>
          </div>

          {/* Variables clave de mayor peso en Random Forest */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1">
                <span>Variables predictoras clave (PCA)</span>
                <span
                  title="V14, V17, V12 y V4 concentran más del 65% del poder discriminante del modelo en Kaggle."
                  className="cursor-help text-slate-500 hover:text-slate-300"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </span>
              <span className="text-[11px] text-slate-500">Valores típicos: -8 a +5</span>
            </div>

            {/* Quick Grid for key components: V14, V17, V12, V4 */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-400">V14 (Top #1)</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V14 ?? 0}
                  onChange={(e) => handleFieldChange('V14', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-rose-400">V17 (Top #2)</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V17 ?? 0}
                  onChange={(e) => handleFieldChange('V17', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-400">V12 (Top #3)</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V12 ?? 0}
                  onChange={(e) => handleFieldChange('V12', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-400">V4 (Top #4)</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V4 ?? 0}
                  onChange={(e) => handleFieldChange('V4', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Quick Grid for secondary components: V10, V11, V16, V2 */}
            <div className="grid grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">V10</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V10 ?? 0}
                  onChange={(e) => handleFieldChange('V10', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">V11</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V11 ?? 0}
                  onChange={(e) => handleFieldChange('V11', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">V16</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V16 ?? 0}
                  onChange={(e) => handleFieldChange('V16', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400">V2</span>
                <input
                  type="number"
                  step="0.1"
                  value={transactionData.V2 ?? 0}
                  onChange={(e) => handleFieldChange('V2', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Toggle Accordion: All V1..V28 */}
          <div className="pt-1">
            <button
              onClick={() => setShowAllVariables(!showAllVariables)}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              {showAllVariables ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{showAllVariables ? 'Ocultar resto de variables' : 'Ver y editar todas las variables (V1 a V28)'}</span>
            </button>

            {showAllVariables && (
              <div className="mt-3 max-h-48 overflow-y-auto p-2 bg-slate-900/80 rounded-lg border border-slate-800 grid grid-cols-4 gap-2 text-[11px] font-mono">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((num) => {
                  const key = `V${num}` as keyof Transaction;
                  return (
                    <div key={num} className="space-y-0.5">
                      <span className="text-slate-500 text-[10px]">V{num}</span>
                      <input
                        type="number"
                        step="0.1"
                        value={(transactionData as any)[key] ?? 0}
                        onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-slate-300 text-[11px]"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
          >
            <span>Analizar transacción</span>
          </button>
        </div>

        {/* Right Column: Resultado de la predicción (col-span-6) */}
        <div className="lg:col-span-6 bg-slate-950/60 border border-slate-800/90 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800/80 pb-2">
              Resultado de la predicción
            </h3>

            {/* Prediction Banner Card */}
            <div
              className={`mt-3 p-4 rounded-xl border flex items-start gap-3.5 ${
                prediction.isFraud
                  ? 'bg-rose-950/50 border-rose-700/80 text-rose-200'
                  : 'bg-emerald-950/50 border-emerald-700/80 text-emerald-200'
              }`}
            >
              {prediction.isFraud ? (
                <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">
                    {prediction.isFraud ? 'Sospechosa de fraude' : 'Transacción legítima'}
                  </h4>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      prediction.isFraud
                        ? 'bg-rose-900 text-rose-200'
                        : 'bg-emerald-900 text-emerald-200'
                    }`}
                  >
                    Riesgo: {prediction.riskScore}%
                  </span>
                </div>
                <div className="text-xs mt-1 text-slate-300 font-mono">
                  Probabilidad estimada de fraude: <strong className="text-white font-bold">{prediction.probability.toFixed(2)}</strong> (Umbral: {prediction.thresholdUsed.toFixed(2)})
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full mt-2.5 overflow-hidden border border-slate-800 relative">
                  <div
                    className={`h-full transition-all duration-500 ${
                      prediction.isFraud
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${Math.max(2, prediction.riskScore)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Principales factores (Importancia de variables / Explicabilidad) */}
            <div className="mt-4 space-y-2">
              <h5 className="text-xs font-semibold text-slate-300">
                Principales factores determinantes (Explicabilidad):
              </h5>
              <div className="space-y-1.5">
                {prediction.topFactors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span className="font-mono text-blue-400">{idx + 1}. {factor.feature}</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          (Valor: {factor.value.toFixed(2)})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{factor.explanation}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        factor.direction === 'increases_risk'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          : factor.direction === 'decreases_risk'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {factor.direction === 'increases_risk'
                        ? 'Eleva riesgo'
                        : factor.direction === 'decreases_risk'
                        ? 'Reduce riesgo'
                        : 'Neutro'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recomendación bancaria institucional */}
          <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
              <span>💡 Recomendación Operativa:</span>
            </div>
            <p className="leading-relaxed text-[11px] text-amber-200/90">
              {prediction.recommendation.title}. {prediction.recommendation.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
