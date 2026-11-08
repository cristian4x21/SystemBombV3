'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { useMounted } from '@/lib/useMounted';
import {
  Boxes,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Flame,
  Truck,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Activity
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { resources, loans, maintenanceList, setActiveTab, currentUser } = useApp();
  const mounted = useMounted();
  const [formattedDate, setFormattedDate] = useState('Noviembre 2026');

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    );
  }, []);

  const totalResources = resources.length;
  const availableResources = resources.filter(r => r.status === 'Disponible').length;
  const inUseResources = resources.filter(r => r.status === 'En Uso').length;
  const inMaintenanceResources = resources.filter(r => r.status === 'En Mantenimiento').length;
  const activeLoans = loans.filter(l => l.status === 'Activo');
  const pendingMaintenance = maintenanceList.filter(m => m.status === 'Programado' || m.status === 'En Curso');

  // Critical Alerts
  const lowStockItems = resources.filter(r => r.stockActual <= r.stockMinimo);
  
  // Safe inspection check without calling new Date() during SSR
  const inspectionAlerts = resources.filter(r => {
    // Check if inspection is due in late 2026 / near term
    return r.inspectionDate <= '2026-11-30';
  });

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 p-6 border border-slate-700 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-600/30 text-red-400 border border-red-500/30">
                Puesto de Comando Digital
              </span>
              <span className="text-xs text-slate-400 capitalize">
                {mounted ? formattedDate : 'Compañía B-233'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Bienvenido, {currentUser.fullName}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Sistema de control logístico, custodia de EPP y preparación de respuesta para la Compañía de Bomberos Virgen de Chapi N.° 233.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('loans')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-900/40 transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Asignar en Guardia</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium text-sm transition-all flex items-center gap-2"
            >
              <Boxes className="w-4 h-4" />
              <span>Ver Inventario</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Catálogo Total</span>
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Boxes className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{totalResources}</span>
            <span className="text-xs text-slate-400">equipos registrados</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>5 Categorías tácticas</span>
            <button onClick={() => setActiveTab('inventory')} className="text-indigo-400 hover:underline flex items-center gap-1">
              Catálogo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Disponibles Inmediatos</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{availableResources}</span>
            <span className="text-xs text-slate-400">listos para salida</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{Math.round((availableResources / (totalResources || 1)) * 100)}% de operatividad</span>
            <span className="text-emerald-400 font-medium">Aptos</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">En Guardia Activa</span>
            <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800/40 flex items-center justify-center">
              <Clock className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-sky-400 tracking-tight">{activeLoans.length}</span>
            <span className="text-xs text-slate-400">préstamos en turno</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{inUseResources} equipos en campo</span>
            <button onClick={() => setActiveTab('loans')} className="text-sky-400 hover:underline flex items-center gap-1">
              Ver préstamos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Mantenimiento y Taller</span>
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 tracking-tight">{pendingMaintenance.length}</span>
            <span className="text-xs text-slate-400">órdenes en curso</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>{inMaintenanceResources} equipos en taller</span>
            <button onClick={() => setActiveTab('maintenance')} className="text-amber-400 hover:underline flex items-center gap-1">
              Flota <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Critical System Alerts (If any) */}
      {(lowStockItems.length > 0 || inspectionAlerts.length > 0) && (
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-600/40 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="text-base font-bold text-amber-200">
              Alertas Logísticas y Técnicas Relevantes
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {lowStockItems.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="text-xs text-amber-400">
                    Stock bajo: {item.stockActual} unidades (Mínimo institucional: {item.stockMinimo})
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {item.code}
                </span>
              </div>
            ))}

            {inspectionAlerts.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-900/80 border border-red-500/30 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{item.name}</div>
                  <div className="text-xs text-red-400">
                    Inspección técnica programada: {item.inspectionDate}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                  {item.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Operational Sections (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Active Loans */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Préstamos Activos en Guardia</h3>
            </div>
            <button
              onClick={() => setActiveTab('loans')}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
            >
              Gestionar todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {activeLoans.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No hay préstamos activos en este momento. Todos los equipos están en almacén.
              </div>
            ) : (
              activeLoans.map(loan => (
                <div key={loan.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-sky-400 font-bold">{loan.code}</span>
                      <h4 className="text-sm font-semibold text-slate-100">{loan.resourceName}</h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Asignado a: <strong className="text-white">{loan.firefighterName}</strong> ({loan.firefighterRank})
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                      {loan.shift}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Retiro: {loan.loanDate}</span>
                    <span>Retorno estimado: {loan.expectedReturnDate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Fleet Operational Readiness */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-white">Estado de la Flota B-233</h3>
            </div>
            <button
              onClick={() => setActiveTab('maintenance')}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
            >
              Ver mantenimientos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {/* Autobomba B-233 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs">
                  B-233
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Autobomba Spartan Gladiator 1500 GPM</h4>
                  <p className="text-xs text-slate-400">Ataque urbano y rescate • Capacidad: 750 galones agua</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Operativa
              </span>
            </div>

            {/* Cisterna C-233 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xs">
                  C-233
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Cisterna Freightliner M2</h4>
                  <p className="text-xs text-slate-400">Abastecimiento pesado • Capacidad: 3500 galones agua</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Operativa
              </span>
            </div>

            {/* Unidad Rescate R-233 */}
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs">
                  R-233
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Unidad de Rescate R-233 Ford F-550</h4>
                  <p className="text-xs text-slate-400">Equipo de extricación pesada, cojines y cuerdas</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                En Revisión
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
