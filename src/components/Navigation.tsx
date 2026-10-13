import React from 'react';
import {
  ShieldAlert,
  Home,
  Database,
  Cpu,
  Sliders,
  BarChart3,
  Scale,
  Presentation,
  LayoutGrid,
  FileText,
} from 'lucide-react';

export type ActiveModuleId = 'resumen' | 'datos' | 'entrenamiento' | 'resultados' | 'simulador' | 'comparacion' | 'conclusiones';

interface NavigationProps {
  activeModule: ActiveModuleId;
  onSelectModule: (module: ActiveModuleId) => void;
  viewMode: 'panoramic' | 'single' | 'presentation';
  onToggleViewMode: (mode: 'panoramic' | 'single' | 'presentation') => void;
  onOpenDocModal: () => void;
  isTrained: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeModule,
  onSelectModule,
  viewMode,
  onToggleViewMode,
  onOpenDocModal,
  isTrained,
}) => {
  const navItems = [
    { id: 'resumen' as ActiveModuleId, label: 'Inicio', icon: Home, num: '1' },
    { id: 'datos' as ActiveModuleId, label: 'Datos', icon: Database, num: '2' },
    { id: 'entrenamiento' as ActiveModuleId, label: 'Entrenamiento', icon: Cpu, num: '3' },
    { id: 'resultados' as ActiveModuleId, label: 'Resultados', icon: BarChart3, num: '4' },
    { id: 'simulador' as ActiveModuleId, label: 'Simulador', icon: Sliders, num: '5' },
    { id: 'comparacion' as ActiveModuleId, label: 'Comparación', icon: Scale, num: '6' },
    { id: 'conclusiones' as ActiveModuleId, label: 'Conclusiones', icon: Presentation, num: '7' },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand & App Title */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white leading-tight">
              Fraude Bancario
            </h1>
            <p className="text-xs text-slate-400">ML Supervisado RF</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="p-3 flex-1 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider">
          MÓDULOS DEL SISTEMA
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectModule(item.id);
                if (viewMode === 'presentation' && item.id !== 'conclusiones') {
                  onToggleViewMode('panoramic');
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center text-xs font-semibold rounded bg-slate-800/70 text-slate-300">
                {item.num}
              </span>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* View Mode Switcher */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 px-2 space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider px-1">
            MODO DE VISTA
          </div>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onToggleViewMode('panoramic')}
              className={`px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                viewMode === 'panoramic'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ver todos los paneles simultáneos como en la maqueta"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tablero</span>
            </button>
            <button
              onClick={() => onToggleViewMode('presentation')}
              className={`px-2 py-1.5 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                viewMode === 'presentation'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo diapositivas para proyector universitario"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Diapositivas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Status & Docs Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Estado del Modelo</div>
            <div className="font-semibold text-white">Random Forest</div>
          </div>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
              isTrained
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
            }`}
          >
            {isTrained ? '✓ Entrenado' : '● Sin entrenar'}
          </span>
        </div>

        <button
          onClick={onOpenDocModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Ficha Técnica y Glosario</span>
        </button>

        <div className="text-[10px] text-slate-400 text-center leading-normal">
          Proyecto Universitario · ML Supervisado
          <br />
          Dataset Kaggle ULB Benchmark
        </div>
      </div>
    </aside>
  );
};
