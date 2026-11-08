'use client';

import React from 'react';
import { useApp, ActiveTab } from '@/lib/context/AppContext';
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Wrench,
  History,
  ShieldCheck,
  AlertTriangle,
  BadgeAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, resources, loans, maintenanceList } = useApp();

  // Metrics for badges
  const lowStockCount = resources.filter(r => r.stockActual <= r.stockMinimo).length;
  const activeLoansCount = loans.filter(l => l.status === 'Activo').length;
  const pendingMaintenanceCount = maintenanceList.filter(m => m.status === 'Programado' || m.status === 'En Curso').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'dashboard',
      label: 'Tablero Operativo',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />
    },
    {
      id: 'inventory',
      label: 'Inventario de Recursos',
      icon: <Boxes className="w-5 h-5 shrink-0" />,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
    },
    {
      id: 'loans',
      label: 'Préstamos en Guardia',
      icon: <ClipboardList className="w-5 h-5 shrink-0" />,
      badge: activeLoansCount > 0 ? activeLoansCount : undefined,
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
    },
    {
      id: 'maintenance',
      label: 'Flota y Mantenimiento',
      icon: <Wrench className="w-5 h-5 shrink-0" />,
      badge: pendingMaintenanceCount > 0 ? pendingMaintenanceCount : undefined,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/40'
    },
    {
      id: 'audit',
      label: 'Bitácora y Auditoría',
      icon: <History className="w-5 h-5 shrink-0" />
    },
    {
      id: 'security',
      label: 'Seguridad y Cripto',
      icon: <ShieldCheck className="w-5 h-5 shrink-0" />
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      
      {/* Navigation Links */}
      <nav className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Módulos Principales
        </div>
        
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-red-600/90 to-red-700 text-white shadow-md shadow-red-950/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Emergency Hotline & Support Footer */}
      <div className="mt-auto p-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
          <BadgeAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-slate-200">Central de Alarma CGBVP</div>
            <div className="text-slate-400 font-mono text-[11px] mt-0.5">Línea de Emergencia: 116</div>
            <div className="text-[10px] text-slate-400 mt-1">Cuartel Paucarpata: (054) 46-2333</div>
          </div>
        </div>
      </div>

    </aside>
  );
};
