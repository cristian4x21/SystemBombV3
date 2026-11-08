'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { History, Shield, Filter, Search, Clock, User, CheckCircle2, AlertTriangle, ArrowUpDown } from 'lucide-react';

export const AuditView: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    const matchesSearch =
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const actionColors: Record<string, string> = {
    'CREACIÓN': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    'ACTUALIZACIÓN': 'bg-sky-500/20 text-sky-400 border-sky-500/40',
    'ELIMINACIÓN': 'bg-red-500/20 text-red-400 border-red-500/40',
    'PRÉSTAMO': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40',
    'DEVOLUCIÓN': 'bg-teal-500/20 text-teal-400 border-teal-500/40',
    'LOGIN': 'bg-amber-500/20 text-amber-400 border-amber-500/40'
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Bitácora de Auditoría y Trazabilidad Operativa
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {auditLogs.length} eventos registrados
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Registro cronológico inmutable de todas las altas, bajas, préstamos de guardia y modificaciones efectuadas en el sistema.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar en la bitácora..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">Todas las Acciones</option>
            <option value="CREACIÓN">Altas / Creaciones</option>
            <option value="ACTUALIZACIÓN">Actualizaciones</option>
            <option value="ELIMINACIÓN">Bajas / Eliminaciones</option>
            <option value="PRÉSTAMO">Préstamos de Guardia</option>
            <option value="DEVOLUCIÓN">Devoluciones</option>
            <option value="LOGIN">Inicios de Sesión</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Acción</th>
                <th className="px-4 py-3.5">Usuario / Cargo</th>
                <th className="px-4 py-3.5">Entidad Afectada</th>
                <th className="px-4 py-3.5">Detalles del Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron registros de auditoría.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${actionColors[log.action] || 'bg-slate-800 text-slate-300'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-200 whitespace-nowrap">
                      {log.user}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300 whitespace-nowrap">
                      {log.entity}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
