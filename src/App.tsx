import React, { useState, useEffect, useMemo } from 'react';
import {
  Navigation,
  ActiveModuleId,
} from './components/Navigation';
import { ModuleResumen } from './components/ModuleResumen';
import { ModuleDatos } from './components/ModuleDatos';
import { ModuleEntrenamiento } from './components/ModuleEntrenamiento';
import { ModuleResultados } from './components/ModuleResultados';
import { ModuleSimulador } from './components/ModuleSimulador';
import { ModuleComparacion } from './components/ModuleComparacion';
import { ModulePresentacion } from './components/ModulePresentacion';
import { TechnicalDocumentationModal } from './components/TechnicalDocumentationModal';

import {
  Transaction,
  DatasetStats,
  TrainingConfig,
  EvaluationMetrics,
} from './types/fraud';
import { KAGGLE_DATASET_STATS } from './data/kaggleBenchmark';
import { mlEngine } from './ml/randomForestEngine';
import { ShieldCheck, Database, Menu, X, Sliders, Presentation, Sparkles } from 'lucide-react';

export default function App() {
  // Estado del Dataset (Benchmark por defecto o CSV personalizado)
  const [stats, setStats] = useState<DatasetStats>(KAGGLE_DATASET_STATS);
  const [customTransactions, setCustomTransactions] = useState<Transaction[] | null>(null);

  // Configuración de ML y Umbral
  const [config, setConfig] = useState<TrainingConfig>(() => mlEngine.getConfig());
  const [isTrained, setIsTrained] = useState<boolean>(true); // Pre-entrenado con el benchmark oficial
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingStep, setTrainingStep] = useState<number>(5);
  const [trainingMessage, setTrainingMessage] = useState<string>('Modelo entrenado y validado.');

  // Métricas reactivas (se recalculan de inmediato al mover el umbral)
  const [metrics, setMetrics] = useState<EvaluationMetrics>(() => mlEngine.evaluateCurrentThreshold());
  const prPoints = useMemo(() => mlEngine.getPrecisionRecallCurve(), [isTrained, config.imbalanceStrategy]);

  // Navegación y Modos de visualización
  const [activeModule, setActiveModule] = useState<ActiveModuleId>('resumen');
  const [viewMode, setViewMode] = useState<'panoramic' | 'single' | 'presentation'>('panoramic');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);

  // Efecto cuando cambia el umbral
  const handleThresholdChange = (newThreshold: number) => {
    mlEngine.setThreshold(newThreshold);
    setConfig((prev) => ({ ...prev, threshold: newThreshold }));
    const newMetrics = mlEngine.evaluateCurrentThreshold();
    setMetrics(newMetrics);
  };

  // Manejo de actualización de configuración del modelo
  const handleConfigChange = (newConfig: Partial<TrainingConfig>) => {
    mlEngine.setConfig(newConfig);
    setConfig((prev) => ({ ...prev, ...newConfig }));
    if (newConfig.imbalanceStrategy) {
      // Re-evaluar impacto de la estrategia
      const newMetrics = mlEngine.evaluateCurrentThreshold();
      setMetrics(newMetrics);
    }
  };

  // Entrenamiento interactivo
  const handleTrainModel = async () => {
    setIsTraining(true);
    setTrainingStep(1);
    try {
      const finalMetrics = await mlEngine.train(
        customTransactions || undefined,
        (step, msg) => {
          setTrainingStep(step);
          setTrainingMessage(msg);
        }
      );
      setMetrics(finalMetrics);
      setIsTrained(true);
    } finally {
      setIsTraining(false);
    }
  };

  // Carga de archivo CSV personalizado
  const handleDatasetUpdate = (newStats: DatasetStats, txs: Transaction[]) => {
    setStats(newStats);
    setCustomTransactions(txs);
    // Auto-entrenar con el nuevo dataset
    setIsTraining(true);
    mlEngine.train(txs, (step, msg) => {
      setTrainingStep(step);
      setTrainingMessage(msg);
    }).then((res) => {
      setMetrics(res);
      setIsTrained(true);
      setIsTraining(false);
    });
  };

  // Restaurar dataset Kaggle benchmark
  const handleResetBenchmark = () => {
    setStats(KAGGLE_DATASET_STATS);
    setCustomTransactions(null);
    mlEngine.setConfig({ imbalanceStrategy: 'class_weight_balanced', threshold: 0.50 });
    setConfig(mlEngine.getConfig());
    const res = mlEngine.evaluateCurrentThreshold();
    setMetrics(res);
  };

  // Desplazamiento suave al módulo seleccionado si estamos en modo panorámico
  const handleSelectModule = (modId: ActiveModuleId) => {
    setActiveModule(modId);
    setIsMobileSidebarOpen(false);

    if (viewMode === 'panoramic') {
      const el = document.getElementById(`module-${modId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm text-white">Fraude Bancario ML</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setViewMode(viewMode === 'panoramic' ? 'presentation' : 'panoramic')}
            className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-medium"
          >
            {viewMode === 'panoramic' ? 'Diapositivas' : 'Tablero'}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div
        className={`${
          isMobileSidebarOpen ? 'fixed inset-0 z-50 flex' : 'hidden md:flex'
        }`}
      >
        <Navigation
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          viewMode={viewMode}
          onToggleViewMode={(mode) => setViewMode(mode)}
          onOpenDocModal={() => setIsDocModalOpen(true)}
          isTrained={isTrained}
        />
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex-1 bg-black/60 md:hidden"
          />
        )}
      </div>

      {/* Main Viewport Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
        {/* Sticky Status Sub-header */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>{stats.sourceName}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Desbalance: <strong className="text-rose-400 font-mono">{stats.fraudPercentage}% fraude</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span>Umbral (τ):</span>
              <span className="font-mono font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-950 border border-blue-900">
                {config.threshold.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setIsDocModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Ver glosario de fórmulas
            </button>
          </div>
        </div>

        {/* MODO 1: TABLERO COMPLETO (PANORÁMICO - COMO EN LA IMAGEN DE REFERENCIA) */}
        {viewMode === 'panoramic' && (
          <div className="space-y-8">
            {/* 1. Pantalla principal (Resumen general) */}
            <div id="module-resumen">
              <ModuleResumen
                stats={stats}
                isTrained={isTrained}
                onExploreDataClick={() => handleSelectModule('datos')}
                onTrainClick={() => handleSelectModule('entrenamiento')}
              />
            </div>

            {/* 2. Exploración de datos */}
            <div id="module-datos">
              <ModuleDatos
                stats={stats}
                onDatasetUpdate={handleDatasetUpdate}
                onResetBenchmark={handleResetBenchmark}
              />
            </div>

            {/* 3. Entrenamiento del modelo */}
            <div id="module-entrenamiento">
              <ModuleEntrenamiento
                config={config}
                onConfigChange={handleConfigChange}
                onThresholdChange={handleThresholdChange}
                onTrainModel={handleTrainModel}
                isTraining={isTraining}
                trainingStep={trainingStep}
                trainingMessage={trainingMessage}
                metrics={metrics}
              />
            </div>

            {/* 4. Resultados del modelo */}
            <div id="module-resultados">
              <ModuleResultados
                metrics={metrics}
                prPoints={prPoints}
              />
            </div>

            {/* 5. Simulador de transacciones */}
            <div id="module-simulador">
              <ModuleSimulador threshold={config.threshold} />
            </div>

            {/* 6. Comparación con clasificador trivial */}
            <div id="module-comparacion">
              <ModuleComparacion metrics={metrics} />
            </div>

            {/* 7. Conclusiones y diapositivas de exposición */}
            <div id="module-conclusiones">
              <ModulePresentacion metrics={metrics} />
            </div>
          </div>
        )}

        {/* MODO 2: VISTA POR MÓDULO INDIVIDUAL */}
        {viewMode === 'single' && (
          <div>
            {activeModule === 'resumen' && (
              <ModuleResumen
                stats={stats}
                isTrained={isTrained}
                onExploreDataClick={() => handleSelectModule('datos')}
                onTrainClick={() => handleSelectModule('entrenamiento')}
              />
            )}
            {activeModule === 'datos' && (
              <ModuleDatos
                stats={stats}
                onDatasetUpdate={handleDatasetUpdate}
                onResetBenchmark={handleResetBenchmark}
              />
            )}
            {activeModule === 'entrenamiento' && (
              <ModuleEntrenamiento
                config={config}
                onConfigChange={handleConfigChange}
                onThresholdChange={handleThresholdChange}
                onTrainModel={handleTrainModel}
                isTraining={isTraining}
                trainingStep={trainingStep}
                trainingMessage={trainingMessage}
                metrics={metrics}
              />
            )}
            {activeModule === 'resultados' && (
              <ModuleResultados
                metrics={metrics}
                prPoints={prPoints}
              />
            )}
            {activeModule === 'simulador' && (
              <ModuleSimulador threshold={config.threshold} />
            )}
            {activeModule === 'comparacion' && (
              <ModuleComparacion metrics={metrics} />
            )}
            {activeModule === 'conclusiones' && (
              <ModulePresentacion metrics={metrics} />
            )}
          </div>
        )}

        {/* MODO 3: MODO DIAPOSITIVAS / PRESENTACIÓN UNIVERSITARIA */}
        {viewMode === 'presentation' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 flex items-center justify-between text-xs text-blue-200">
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">Modo Proyección para Exposición</span>
                <span>— Diapositivas sintetizadas para proyectar en clase universitaria.</span>
              </div>
              <button
                onClick={() => setViewMode('panoramic')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
              >
                Volver al Tablero Completo
              </button>
            </div>
            <ModulePresentacion metrics={metrics} />
          </div>
        )}
      </main>

      {/* Modal de Documentación Técnica y Fórmulas */}
      <TechnicalDocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />
    </div>
  );
}
