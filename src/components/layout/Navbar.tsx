'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Shield, ShieldAlert, UserCheck, Flame, Radio, FileSpreadsheet, RefreshCw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole, exportInventoryCSV, resetToInitialData } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Institution Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30 ring-1 ring-white/20">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                SystemBomb
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-950/80 text-red-400 border border-red-800/60 rounded-full tracking-wide">
                B-233 PAUCARPATA
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              VII Comandancia Departamental Arequipa • CGBVP
            </p>
          </div>
        </div>

        {/* Operational Status Pulse */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Estado:</span>
          <span className="text-emerald-400 font-semibold">100% Operativo en Guardia</span>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Quick Actions */}
          <div className="hidden lg:flex items-center gap-1.5 border-r border-slate-800 pr-3">
            <button
              onClick={exportInventoryCSV}
              title="Descargar reporte CSV de inventario"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={resetToInitialData}
              title="Restaurar datos iniciales de demostración"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <RefreshCw className="w-4 h-4 text-sky-400" />
              <span>Reset</span>
            </button>
          </div>

          {/* Role Indicator & Quick Switch */}
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/70 p-1.5 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-200">
              {currentUser.role === 'admin_logistica' ? (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              ) : (
                <Shield className="w-4 h-4 text-sky-400" />
              )}
            </div>
            
            <div className="text-left hidden sm:block pr-2">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser.fullName}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {currentUser.rank}
              </div>
            </div>

            <div className="flex bg-slate-900/90 p-0.5 rounded-lg border border-slate-700/50 text-[11px] font-medium">
              <button
                onClick={() => switchRole('admin_logistica')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currentUser.role === 'admin_logistica'
                    ? 'bg-red-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => switchRole('bombero_operativo')}
                className={`px-2 py-1 rounded-md transition-all ${
                  currentUser.role === 'bombero_operativo'
                    ? 'bg-sky-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bombero
              </button>
            </div>

          </div>

        </div>

      </div>
    </header>
  );
};
