import React, { useState } from 'react';
import {
  Search,
  Filter,
  Upload,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction, DatasetStats } from '../types/fraud';
import { INITIAL_TABLE_PREVIEW, parseCSVFile } from '../data/kaggleBenchmark';

interface ModuleDatosProps {
  stats: DatasetStats;
  onDatasetUpdate: (newStats: DatasetStats, customTransactions: Transaction[]) => void;
  onResetBenchmark: () => void;
}

export const ModuleDatos: React.FC<ModuleDatosProps> = ({
  stats,
  onDatasetUpdate,
  onResetBenchmark,
}) => {
  const [filterClass, setFilterClass] = useState<'all' | 'legit' | 'fraud'>('all');
  const [scaleMode, setScaleMode] = useState<'log' | 'linear'>('log');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Filtrado de la tabla de muestra
  const filteredData = INITIAL_TABLE_PREVIEW.filter((row) => {
    if (filterClass === 'legit') return row.Class === 0;
    if (filterClass === 'fraud') return row.Class === 1;
    return true;
  });

  const pageSize = 6;
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const displayedRows = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Manejo de carga de archivo CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = parseCSVFile(content);

      setIsUploading(false);
      if (res.success && res.stats && res.transactions) {
        setUploadSuccess(
          `Archivo cargado con éxito: ${res.totalRows?.toLocaleString()} transacciones procesadas (${res.stats.fraudCount} fraudes detectados).`
        );
        onDatasetUpdate(res.stats, res.transactions);
      } else {
        setUploadError(res.errorMessage || 'Error al procesar el archivo CSV.');
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      setUploadError('Error al leer el archivo desde el disco.');
    };
    reader.readAsText(file);
  };

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
            2
          </span>
          <span className="text-base text-white font-bold tracking-tight">
            Exploración de datos
          </span>
        </div>

        {/* CSV Upload & Reset Actions */}
        <div className="flex items-center gap-2">
          {stats.isCustomLoaded && (
            <button
              onClick={onResetBenchmark}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restaurar Benchmark Kaggle</span>
            </button>
          )}

          <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploading ? 'Procesando...' : 'Cargar CSV propio'}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Upload Feedback Notices */}
      {uploadSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Grid: Table preview + Class distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vista previa de las transacciones (col-span-7) */}
        <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span>Vista previa de las transacciones</span>
              </h3>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => { setFilterClass('all'); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterClass === 'all'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => { setFilterClass('legit'); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterClass === 'legit'
                      ? 'bg-emerald-700 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Legítimas (0)
                </button>
                <button
                  onClick={() => { setFilterClass('fraud'); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterClass === 'fraud'
                      ? 'bg-rose-700 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Fraudes (1)
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">V1</th>
                    <th className="py-2.5 px-3">V2</th>
                    <th className="py-2.5 px-3">V3</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-center">Class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {displayedRows.map((tx, idx) => (
                    <tr
                      key={tx.id ?? idx}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        tx.Class === 1 ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-slate-400 tabular-nums">{tx.Time}</td>
                      <td className="py-2 px-3 tabular-nums">{tx.V1?.toFixed(4)}</td>
                      <td className="py-2 px-3 tabular-nums">{tx.V2?.toFixed(4)}</td>
                      <td className="py-2 px-3 tabular-nums">{tx.V3?.toFixed(4)}</td>
                      <td className="py-2 px-3 text-right font-semibold tabular-nums text-white">
                        €{tx.Amount?.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.Class === 1
                              ? 'bg-rose-600 text-white'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          }`}
                        >
                          {tx.Class}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
            <span>
              Mostrando {displayedRows.length} de {filteredData.length} transacciones de muestra
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
              >
                Anterior
              </button>
              <span className="px-2 text-white font-medium">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Distribución de clases e información de variables (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Distribución de clases */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Distribución de clases</h3>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
                <button
                  onClick={() => setScaleMode('log')}
                  className={`px-2 py-0.5 rounded ${
                    scaleMode === 'log' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'
                  }`}
                  title="Escala logarítmica para visualizar ambas clases"
                >
                  Log (10ⁿ)
                </button>
                <button
                  onClick={() => setScaleMode('linear')}
                  className={`px-2 py-0.5 rounded ${
                    scaleMode === 'linear' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'
                  }`}
                  title="Escala lineal: el fraude resulta casi imperceptible"
                >
                  Lineal
                </button>
              </div>
            </div>

            {/* Visual Logarithmic / Linear Bars */}
            <div className="h-44 flex items-end justify-around pb-4 pt-2 border-b border-slate-800/80 relative">
              {/* Y-axis labels for log scale */}
              {scaleMode === 'log' && (
                <div className="absolute left-1 top-2 bottom-6 flex flex-col justify-between text-[10px] text-slate-400 font-mono">
                  <span>10⁶</span>
                  <span>10⁵</span>
                  <span>10⁴</span>
                  <span>10²</span>
                  <span>10⁰</span>
                </div>
              )}

              {/* Bar 1: Legitimate (284,315) */}
              <div className="flex flex-col items-center gap-2 z-10 w-28">
                <span className="text-xs font-mono font-bold text-blue-400 tabular-nums">
                  {stats.legitimateCount.toLocaleString()}
                </span>
                <div
                  className="w-16 bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-lg transition-all duration-500 shadow-lg shadow-blue-900/30"
                  style={{
                    height: scaleMode === 'log' ? '120px' : '130px',
                  }}
                />
                <div className="text-center">
                  <div className="text-xs font-semibold text-white">Legítimas</div>
                  <div className="text-[10px] text-slate-400 font-mono">(Class = 0)</div>
                </div>
              </div>

              {/* Bar 2: Fraud (492) */}
              <div className="flex flex-col items-center gap-2 z-10 w-28">
                <span className="text-xs font-mono font-bold text-rose-400 tabular-nums">
                  {stats.fraudCount.toLocaleString()}
                </span>
                <div
                  className="w-16 bg-gradient-to-t from-rose-700 to-red-500 rounded-t-lg transition-all duration-500 shadow-lg shadow-red-900/30"
                  style={{
                    // En escala log: log10(492)=2.69 vs log10(284315)=5.45 -> ~50% de la altura
                    // En lineal: 492 / 284315 = 0.0017 -> ~1px (casi invisible!)
                    height: scaleMode === 'log' ? '58px' : '4px',
                  }}
                />
                <div className="text-center">
                  <div className="text-xs font-semibold text-rose-300">Fraudes</div>
                  <div className="text-[10px] text-rose-400 font-mono">(Class = 1)</div>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-400 text-center">
              {scaleMode === 'log' ? (
                <span>
                  Visualizado en <strong>escala logarítmica</strong> para apreciar ambas clases.
                </span>
              ) : (
                <span className="text-amber-400">
                  En escala lineal, el fraude (0.17%) es una línea minúscula imperceptible.
                </span>
              )}
            </div>
          </div>

          {/* Información de variables */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Información de variables</span>
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>
                <span className="font-semibold text-blue-300">V1 - V28: </span>
                Componentes transformados mediante PCA (Análisis de Componentes Principales)
                para proteger la confidencialidad bancaria. No representan campos directos como ciudad o comercio.
              </li>
              <li>
                <span className="font-semibold text-blue-300">Time: </span>
                Tiempo en segundos transcurrido desde la primera transacción de la serie (2 días).
              </li>
              <li>
                <span className="font-semibold text-blue-300">Amount: </span>
                Monto de la transacción en Euros (€).
              </li>
              <li>
                <span className="font-semibold text-blue-300">Class: </span>
                Variable objetivo (0 = legítima, 1 = fraude).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
