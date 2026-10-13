import React from 'react';
import {
  Target,
  BarChart3,
  CheckCircle,
  Share2,
  Gauge,
  HelpCircle,
  Info,
} from 'lucide-react';
import { EvaluationMetrics, PRCurvePoint } from '../types/fraud';

interface ModuleResultadosProps {
  metrics: EvaluationMetrics;
  prPoints: PRCurvePoint[];
}

export const ModuleResultados: React.FC<ModuleResultadosProps> = ({
  metrics,
  prPoints,
}) => {
  const cm = metrics.confusionMatrix;

  // Encontrar el punto más cercano en la curva Precision-Recall al umbral actual
  const currentRecall = metrics.recall;
  const currentPrecision = metrics.precision;

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
            4
          </span>
          <span className="text-base text-white font-bold tracking-tight">
            Resultados del modelo (Evaluación)
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Umbral activo: <span className="text-blue-400 font-bold">τ = {metrics.threshold.toFixed(2)}</span>
        </div>
      </div>

      {/* 5 Big Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* AUPRC (Gold standard) */}
        <div className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-400 mb-1">
            <span className="text-xs font-bold">AUPRC</span>
            <Target className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {metrics.auprc.toFixed(3)}
          </div>
          <div className="text-[10px] text-purple-300/80 mt-1">
            Área Curva P-R (Métrica clave)
          </div>
        </div>

        {/* Precision */}
        <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-400 mb-1">
            <span className="text-xs font-bold">Precision</span>
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {metrics.precision.toFixed(3)}
          </div>
          <div className="text-[10px] text-blue-300/80 mt-1">
            TP / (TP + FP) · Pocas falsas alarmas
          </div>
        </div>

        {/* Recall */}
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-xs font-bold">Recall</span>
            <CheckCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {metrics.recall.toFixed(3)}
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-1">
            TP / (TP + FN) · Sensibilidad
          </div>
        </div>

        {/* F1-score */}
        <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-400 mb-1">
            <span className="text-xs font-bold">F1-score</span>
            <Share2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            {metrics.f1Score.toFixed(3)}
          </div>
          <div className="text-[10px] text-sky-300/80 mt-1">
            Media armónica P y R
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold">Accuracy</span>
            <Gauge className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-200 font-mono tabular-nums">
            {metrics.accuracy.toFixed(3)}
          </div>
          <div className="text-[10px] text-amber-400 mt-1">
            Referencia complementaria
          </div>
        </div>
      </div>

      {/* Grid: Confusion Matrix + PR Curve + Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Matriz de confusión (col-span-4) */}
        <div className="md:col-span-4 bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Matriz de confusión
            </h4>

            {/* Matrix Table */}
            <div className="text-xs font-mono">
              <div className="grid grid-cols-3 gap-1 text-center font-sans font-semibold text-[11px] mb-1">
                <div></div>
                <div className="text-slate-400">Pred. Legítima (0)</div>
                <div className="text-slate-400">Pred. Fraude (1)</div>
              </div>

              {/* Row 1: Real Legítima */}
              <div className="grid grid-cols-3 gap-1.5 items-stretch mb-1.5">
                <div className="flex items-center justify-end pr-2 font-sans font-semibold text-[11px] text-slate-300">
                  Real (0)
                </div>
                {/* Verdadero Negativo */}
                <div
                  className="bg-blue-950/80 border border-blue-800/80 text-white rounded-lg p-2.5 text-center flex flex-col justify-center"
                  title="Verdadero Negativo (TN): Transacción legítima aprobada normalmente"
                >
                  <span className="text-lg font-bold tabular-nums">
                    {cm.trueNegatives.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-blue-300 font-sans">
                    VN (Legítima OK)
                  </span>
                </div>
                {/* Falso Positivo */}
                <div
                  className="bg-slate-800/80 border border-slate-700/80 text-amber-300 rounded-lg p-2.5 text-center flex flex-col justify-center"
                  title="Falso Positivo (FP): Falsa alarma, cliente legítimo bloqueado"
                >
                  <span className="text-lg font-bold tabular-nums">
                    {cm.falsePositives.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    FP (Falsa alarma)
                  </span>
                </div>
              </div>

              {/* Row 2: Real Fraude */}
              <div className="grid grid-cols-3 gap-1.5 items-stretch">
                <div className="flex items-center justify-end pr-2 font-sans font-semibold text-[11px] text-rose-300">
                  Real (1)
                </div>
                {/* Falso Negativo */}
                <div
                  className="bg-rose-950/60 border border-rose-800/70 text-rose-300 rounded-lg p-2.5 text-center flex flex-col justify-center"
                  title="Falso Negativo (FN): Fraude no detectado (Pérdida para el banco)"
                >
                  <span className="text-lg font-bold tabular-nums">
                    {cm.falseNegatives.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-rose-400 font-sans font-medium">
                    FN (Fraude omitido)
                  </span>
                </div>
                {/* Verdadero Positivo */}
                <div
                  className="bg-red-700 text-white rounded-lg p-2.5 text-center shadow-lg shadow-red-950/50 flex flex-col justify-center"
                  title="Verdadero Positivo (TP): Fraude detectado con éxito a tiempo"
                >
                  <span className="text-lg font-bold tabular-nums">
                    {cm.truePositives.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-white/90 font-sans font-bold">
                    VP (Fraude detectado)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span>Sensibilidad / Detección:</span>
            <span className="font-bold text-emerald-400 font-mono">
              {((cm.truePositives / (cm.truePositives + cm.falseNegatives)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Curva Precision-Recall SVG (col-span-5) */}
        <div className="md:col-span-5 bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Curva Precision-Recall
              </h4>
              <span className="text-[10px] text-purple-300 font-mono">AUPRC = {metrics.auprc}</span>
            </div>

            {/* SVG Plot */}
            <div className="w-full h-44 relative bg-slate-900/60 rounded-lg p-2 border border-slate-800">
              <svg viewBox="0 0 260 160" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="30" y1="130" x2="250" y2="130" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="20" x2="30" y2="130" stroke="#334155" strokeWidth="1" />
                <line x1="30" y1="75" x2="250" y2="75" stroke="#1E293B" strokeDasharray="3 3" />
                <line x1="140" y1="20" x2="140" y2="130" stroke="#1E293B" strokeDasharray="3 3" />

                {/* Y Axis Labels (Precision) */}
                <text x="24" y="24" fill="#94A3B8" fontSize="8" textAnchor="end">1.0</text>
                <text x="24" y="78" fill="#94A3B8" fontSize="8" textAnchor="end">0.5</text>
                <text x="24" y="132" fill="#94A3B8" fontSize="8" textAnchor="end">0.0</text>
                <text x="12" y="75" fill="#64748B" fontSize="8" textAnchor="middle" transform="rotate(-90 12 75)">Precision</text>

                {/* X Axis Labels (Recall) */}
                <text x="30" y="142" fill="#94A3B8" fontSize="8" textAnchor="middle">0.0</text>
                <text x="140" y="142" fill="#94A3B8" fontSize="8" textAnchor="middle">0.5</text>
                <text x="250" y="142" fill="#94A3B8" fontSize="8" textAnchor="middle">1.0</text>
                <text x="140" y="154" fill="#64748B" fontSize="8" textAnchor="middle">Recall</text>

                {/* Clasificador Trivial Baseline (y = 0.0017 near bottom) */}
                <line
                  x1="30"
                  y1="128"
                  x2="250"
                  y2="128"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Area Fill for Random Forest */}
                <path
                  d="M 30 20 L 30 22 L 110 24 L 180 32 L 210 44 L 230 70 L 245 110 L 250 130 L 30 130 Z"
                  fill="#3B82F6"
                  fillOpacity="0.2"
                />

                {/* Random Forest PR Curve Line */}
                <path
                  d="M 30 20 Q 140 24 190 38 T 235 75 T 250 130"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  fill="none"
                />

                {/* Operating Point marker based on current recall/precision */}
                {/* Map recall 0..1 to x 30..250; precision 0..1 to y 130..20 */}
                <circle
                  cx={30 + currentRecall * 220}
                  cy={130 - currentPrecision * 110}
                  r="5"
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-2 text-[10px] flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
              <span className="text-slate-300">Random Forest</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed border-red-500"></span>
              <span>Línea base (0.0017)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Punto actual (τ={metrics.threshold.toFixed(2)})</span>
            </div>
          </div>
        </div>

        {/* Interpretación pedagógica (col-span-3) */}
        <div className="md:col-span-3 bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Interpretación</span>
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              El modelo obtiene un alto <strong className="text-purple-300">AUPRC ({metrics.auprc})</strong>, lo que indica que logra identificar la mayoría de los fraudes manteniendo un volumen reducido de falsas alarmas.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed mt-2">
              La <strong>exactitud (accuracy)</strong> supera el 99.9% debido al desbalance natural de clases, por lo que nunca debe usarse como métrica aislada en auditorías de fraude.
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-blue-300/90">
            💡 <em>Al reducir el umbral a 0.20 se detectan más fraudes (mayor Recall) a costa de más clientes legítimos molestos (menor Precision).</em>
          </div>
        </div>
      </div>
    </section>
  );
};
