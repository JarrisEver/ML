import React from 'react';
import { Scale, Lightbulb, AlertTriangle, ShieldCheck, Check, X } from 'lucide-react';
import { EvaluationMetrics } from '../types/fraud';
import { mlEngine } from '../ml/randomForestEngine';

interface ModuleComparacionProps {
  metrics: EvaluationMetrics;
}

export const ModuleComparacion: React.FC<ModuleComparacionProps> = ({ metrics }) => {
  const trivial = mlEngine.getTrivialClassifierMetrics();

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
          6
        </span>
        <span className="text-base text-white font-bold tracking-tight">
          Comparación con clasificador trivial (La Paradoja de la Exactitud)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Comparative Table (col-span-7) */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Métrica</th>
                  <th className="py-2.5 px-3 text-center text-blue-400 font-bold">Random Forest</th>
                  <th className="py-2.5 px-3 text-center text-slate-400 font-bold">Siempre Legítima (Dummy)</th>
                  <th className="py-2.5 px-3 text-center">Evaluación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {/* Accuracy */}
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                    Accuracy (Exactitud)
                  </td>
                  <td className="py-2.5 px-3 text-center text-white font-bold tabular-nums">
                    {metrics.accuracy.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-amber-300 font-bold tabular-nums">
                    0.9983
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] text-amber-400 font-sans font-semibold">
                      ⚠️ Métrica engañosa
                    </span>
                  </td>
                </tr>

                {/* Precision */}
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">Precision</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold tabular-nums">
                    {metrics.precision.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-rose-400 tabular-nums">
                    0.000
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] text-emerald-400 font-sans font-semibold">
                      ✓ Pocas falsas alarmas
                    </span>
                  </td>
                </tr>

                {/* Recall */}
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">Recall (Sensibilidad)</td>
                  <td className="py-2.5 px-3 text-center text-emerald-400 font-bold tabular-nums">
                    {metrics.recall.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-rose-400 tabular-nums">
                    0.000
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] text-emerald-400 font-sans font-semibold">
                      ✓ Detecta {Math.round(metrics.recall * 100)}% de fraudes
                    </span>
                  </td>
                </tr>

                {/* F1-score */}
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">F1-Score</td>
                  <td className="py-2.5 px-3 text-center text-blue-400 font-bold tabular-nums">
                    {metrics.f1Score.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-rose-400 tabular-nums">
                    0.000
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] text-blue-400 font-sans font-semibold">
                      ✓ Balance armónico
                    </span>
                  </td>
                </tr>

                {/* AUPRC */}
                <tr className="hover:bg-slate-800/40 bg-purple-950/20">
                  <td className="py-2.5 px-3 font-sans font-bold text-purple-300">
                    AUPRC (Precision-Recall AUC)
                  </td>
                  <td className="py-2.5 px-3 text-center text-purple-300 font-extrabold tabular-nums">
                    {metrics.auprc.toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-center text-rose-400 tabular-nums">
                    0.0017
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] text-purple-300 font-sans font-extrabold">
                      ⭐ Estándar dorado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Callout Notice Card */}
          <div className="mt-4 p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl flex items-start gap-3 text-xs text-blue-200">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Un modelo ingenuo que prediga <strong>siempre que una transacción es legítima</strong> obtendrá un{' '}
              <strong>99.83% de exactitud (accuracy)</strong> sin haber aprendido absolutamente nada, permitiendo que el 100% de los fraudes se ejecuten. Por eso, en problemas con clases desbalanceadas se evalúa mediante <strong>AUPRC, Precision y Recall</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Explicación académica de la paradoja (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/90 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>¿Por qué el 99.83% es una trampa mortal?</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                En el dataset de Kaggle hay <strong className="text-white font-mono">284,315 transacciones legítimas</strong> y solo <strong className="text-rose-400 font-mono">492 fraudulentas</strong>.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div>Accuracy = (TN + TP) / Total</div>
                <div className="text-amber-400">Accuracy = (284,315 + 0) / 284,807 = <span className="font-bold">99.827%</span></div>
              </div>
              <p>
                Si un banco implementara este clasificador trivial, presumiría ante su directorio de un sistema con casi el 100% de acierto, pero sufriría pérdidas millonarias directas porque <strong>no detendría ni un solo fraude</strong>.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-white">Conclusión universitaria clave: </span>
            AUPRC compara la capacidad predictiva contra la prevalencia base (0.0017). Random Forest alcanza <strong className="text-purple-400">{metrics.auprc}</strong>, demostrando un verdadero aprendizaje estadístico.
          </div>
        </div>
      </div>
    </section>
  );
};
