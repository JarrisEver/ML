import React, { useState } from 'react';
import {
  Presentation,
  BookOpen,
  Mic,
  ChevronLeft,
  ChevronRight,
  Target,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { EvaluationMetrics } from '../types/fraud';

interface ModulePresentacionProps {
  metrics: EvaluationMetrics;
  isPresentationMode?: boolean;
  onTogglePresentationMode?: () => void;
}

export const ModulePresentacion: React.FC<ModulePresentacionProps> = ({
  metrics,
  isPresentationMode = false,
  onTogglePresentationMode,
}) => {
  const [activeSlide, setActiveSlide] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'slides' | 'script' | 'qa'>('slides');

  // Contenido organizado de las 3 diapositivas universitarias obligatorias
  const slides = [
    {
      num: 1,
      title: 'Caso real, problema y dataset de Kaggle',
      subtitle: 'El desafío del desbalance masivo en la banca moderna',
      points: [
        {
          label: 'Problema de negocio',
          text: 'Las entidades financieras procesan cientos de miles de pagos diarios; identificar fraudes en milisegundos reduce millones en pérdidas sin bloquear transacciones legítimas.',
        },
        {
          label: 'Dataset Credit Card Fraud (ULB - Kaggle)',
          text: 'Registros reales de operaciones realizadas con tarjetas de crédito en Europa durante 2 días.',
        },
        {
          label: 'Distribución estadística',
          text: '284,807 transacciones en total. 492 fraudes frente a 284,315 legítimas (apenas un 0.172% de operaciones fraudulentas).',
        },
        {
          label: 'Estructura de variables',
          text: 'Variables V1 a V28 transformadas mediante Análisis de Componentes Principales (PCA) por confidencialidad. Variables Time, Amount (euros) y Class (0 = legítima, 1 = fraude).',
        },
      ],
      tag: 'Diapositiva 1 · Problema y Datos',
    },
    {
      num: 2,
      title: 'Aprendizaje supervisado y algoritmo Random Forest',
      subtitle: 'Ensamble de árboles de decisión para clasificación binaria',
      points: [
        {
          label: '¿Por qué aprendizaje supervisado?',
          text: 'Porque disponemos de datos históricos donde cada transacción posee su etiqueta real de validación (Class: 0 o 1). El modelo aprende los vectores que separan ambos comportamientos.',
        },
        {
          label: 'Algoritmo Random Forest',
          text: 'Ensamble (Bagging) de múltiples árboles de decisión independientes entrenados con subconjuntos aleatorios de transacciones y subespacios aleatorios de variables (features).',
        },
        {
          label: 'Estrategia ante el desbalance',
          text: "Uso de 'class_weight = balanced' para asignar penalizaciones fuertemente superiores al error en la clase minoritaria, evitando que el modelo se incline ciegamente por la clase legítima.",
        },
        {
          label: 'Prevención de fuga de datos',
          text: 'División estratificada estricta en 80% entrenamiento y 20% prueba. La optimización del umbral y las métricas finales se calculan exclusivamente en datos de prueba no vistos.',
        },
      ],
      tag: 'Diapositiva 2 · Algoritmo y Metodología',
    },
    {
      num: 3,
      title: 'Simulación, métricas, resultados y conclusiones',
      subtitle: 'Evaluación rigurosa mediante AUPRC y aplicación operativa',
      points: [
        {
          label: 'AUPRC como métrica dorada',
          text: `AUPRC = ${metrics.auprc} (frente a 0.0017 del clasificador trivial). Demuestra una alta precisión en la recuperación de transacciones fraudulentas.`,
        },
        {
          label: 'Recall y Precision',
          text: `Recall = ${metrics.recall} (captura más del 82% de los fraudes reales) y Precision = ${metrics.precision} (minimizando falsas alarmas que frustren a clientes legítimos).`,
        },
        {
          label: 'Simulación y calibración de umbral',
          text: 'El umbral de clasificación (τ) permite al comité de riesgo bancario ajustar la agresividad del sistema según el apetito de riesgo de la institución.',
        },
        {
          label: 'Conclusión y rol de la revisión humana',
          text: 'El Machine Learning es una herramienta de asistencia y primera barrera defensiva; no reemplaza la auditoría humana ni las políticas antifraude multidimensionales (2FA, biometría).',
        },
      ],
      tag: 'Diapositiva 3 · Resultados y Conclusión',
    },
  ];

  // Guion oral universitario estructurado minuto a minuto
  const oralScript = [
    {
      time: 'Minuto 0:00 - 1:30',
      part: 'Introducción y el Problema del Desbalance',
      script:
        '“Buenos días, profesor y compañeros. Hoy les presentamos nuestro sistema inteligente de detección de fraudes bancarios mediante Machine Learning supervisado. En el mundo financiero, el gran desafío es una aguja en un pajar: en el dataset de referencia de Kaggle, de más de 284 mil transacciones, solo el 0.17% son fraudulentas. Si un modelo dijera ciegamente que todas son legítimas, tendría un 99.8% de exactitud, pero no detectaría ningún fraude. Este es el motivo por el cual no podemos conformarnos con la métrica de exactitud y requerimos métricas avanzadas.”',
    },
    {
      time: 'Minuto 1:30 - 3:30',
      part: 'Aprendizaje Supervisado y Random Forest',
      script:
        '“Para abordar este reto utilizamos Random Forest, un modelo de aprendizaje supervisado de clasificación binaria. A partir de transacciones históricas etiquetadas, construimos un ensamble de 100 árboles de decisión. Cada árbol se entrena con muestras bootstrap y subconjuntos aleatorios de variables. Para contrarrestar el desbalance masivo, aplicamos class_weight=\'balanced\', lo que penaliza con severidad pasar por alto un fraude. Además, garantizamos una división estratificada sin fuga de datos entre entrenamiento y prueba.”',
    },
    {
      time: 'Minuto 3:30 - 5:00',
      part: 'Métricas Reales, AUPRC y Matriz de Confusión',
      script:
        '“Como pueden observar en nuestro panel de evaluación, el modelo alcanza un AUPRC de 0.932, muy superior a la línea base trivial de 0.0017. En la matriz de confusión observamos que captura más del 82% de los fraudes (Recall) con una precisión del 87%, logrando el balance ideal entre dinero protegido y clientes no incomodados por falsos bloqueos. Además, nuestro simulador permite calibrar el umbral de decisión en tiempo real.”',
    },
    {
      time: 'Minuto 5:00 - 6:30',
      part: 'Demostración Interactiva y Conclusiones',
      script:
        '“En el simulador hemos probado transacciones reales de ataque donde componentes anonimizados como V14 y V17 toman valores negativos extremos, alertando inmediatamente al sistema. Como conclusión, el Machine Learning supervisado con Random Forest demuestra ser una herramienta de enorme eficacia para la banca, reduciendo pérdidas millonarias y sirviendo de soporte al equipo de analistas de seguridad, quienes mantienen siempre la decisión final.”',
    },
  ];

  // Preguntas frecuentes del jurado y respuestas técnicas
  const qaDefense = [
    {
      q: '¿Por qué eligieron Random Forest en lugar de una simple Regresión Logística?',
      a: 'Random Forest es un ensamble no paramétrico capaz de capturar relaciones no lineales e interacciones complejas entre las 28 variables PCA sin requerir transformaciones manuales, y es altamente resistente al sobreajuste gracias al promediado de árboles independientes.',
    },
    {
      q: '¿Por qué las variables se llaman V1 a V28 y no tienen nombres como comercio o país?',
      a: 'El dataset original de la Universidad Libre de Bruselas anonimizó estas características mediante PCA (Principal Component Analysis) para proteger el secreto bancario y los datos personales de los clientes conforme a normativas de privacidad.',
    },
    {
      q: '¿Qué pasaría si en producción cambiamos el umbral de clasificación de 0.50 a 0.20?',
      a: 'Aumentaríamos la sensibilidad (Recall), capturando fraudes más sutiles, pero se incrementarían los falsos positivos (clientes a los que se les bloquearía temporalmente su tarjeta legítima). La entidad define este umbral según el costo relativo de perder dinero frente al costo de molestar a un cliente.',
    },
  ];

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
            7
          </span>
          <span className="text-base text-white font-bold tracking-tight">
            Conclusiones y diapositivas (Preparación para exposición universitaria)
          </span>
        </div>

        {/* Tab Switcher: Slides / Guion / Preguntas */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
              activeTab === 'slides' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>3 Diapositivas</span>
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
              activeTab === 'script' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Guion Oral</span>
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors ${
              activeTab === 'qa' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Defensa / Preguntas</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 3 DIAPOSITIVAS INTERACTIVAS */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          {/* Quick 3-card overview as seen in screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slides.map((s) => (
              <div
                key={s.num}
                onClick={() => setActiveSlide(s.num)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activeSlide === s.num
                    ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-900/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {s.num}
                  </span>
                  <span className="text-xs font-bold text-white truncate">{s.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{s.subtitle}</p>
                <div className="mt-3 text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                  <span>Ver diapositiva en proyector</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Slide Viewer (Proyector universitario) */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            {/* Slide Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800/60">
                {slides[activeSlide - 1].tag}
              </span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Diapositiva {activeSlide} de 3</span>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    disabled={activeSlide === 1}
                    onClick={() => setActiveSlide((s) => Math.max(1, s - 1))}
                    className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-30 hover:text-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeSlide === 3}
                    onClick={() => setActiveSlide((s) => Math.min(3, s + 1))}
                    className="p-1 rounded bg-slate-900 border border-slate-800 disabled:opacity-30 hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Content */}
            <div className="space-y-4">
              <h3 className="text-xl md:text-2xl font-extrabold text-white">
                {slides[activeSlide - 1].title}
              </h3>
              <p className="text-sm font-medium text-blue-400">
                {slides[activeSlide - 1].subtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {slides[activeSlide - 1].points.map((pt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                  >
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{pt.label}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Facultad de Ingeniería / Ciencias de la Computación</span>
              <span>Random Forest · Dataset Kaggle ULB</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUION ORAL PARA EL EXPOSITOR */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/50 text-xs text-blue-200 flex items-start gap-3">
            <Mic className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">
                Guion oral sugerido para la exposición (Duración estimada: 6 a 7 minutos)
              </div>
              <p className="text-slate-300 mt-1">
                Utiliza este guion como guía natural durante tu presentación. Habla con pausas claras,
                enfatiza por qué la exactitud engaña en clases desbalanceadas y apóyate en el simulador interactivo para la demostración en vivo.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {oralScript.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{step.part}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{step.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 italic">
                  {step.script}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BANCO DE PREGUNTAS Y DEFENSA ANTE EL JURADO */}
      {activeTab === 'qa' && (
        <div className="space-y-3">
          <div className="p-3 bg-purple-950/30 border border-purple-800/50 rounded-xl text-xs text-purple-200">
            <strong>Consejo para la defensa: </strong> Los profesores suelen evaluar si realmente comprendes el desbalance de clases, la división sin fuga de datos y el valor práctico del AUPRC frente a la exactitud.
          </div>

          {qaDefense.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs"
            >
              <div className="font-bold text-white flex items-start gap-2">
                <span className="text-blue-400 font-mono">P{idx + 1}:</span>
                <span>{item.q}</span>
              </div>
              <div className="text-slate-300 leading-relaxed pl-5 border-l-2 border-blue-500/50">
                {item.a}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
