'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Loan, ShiftType } from '@/types';
import {
  ClipboardList,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  User,
  Shield,
  Calendar,
  X,
  Trash2,
  FileText
} from 'lucide-react';

const SHIFTS: ShiftType[] = [
  'Guardia Nocturna A',
  'Guardia Diurna B',
  'Guardia Bravo',
  'Comisión de Servicio Especial'
];

export const LoansView: React.FC = () => {
  const { loans, resources, createLoan, returnLoan, deleteLoan, currentUser, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [returningLoan, setReturningLoan] = useState<Loan | null>(null);

  // Create Form State
  const [formData, setFormData] = useState({
    resourceId: '',
    firefighterName: currentUser.fullName,
    firefighterRank: currentUser.rank,
    shift: SHIFTS[0],
    expectedReturnDate: '2026-11-08 20:30',
    notes: ''
  });

  // Return Form State
  const [returnCondition, setReturnCondition] = useState<'Óptimo' | 'Buen Estado' | 'Deteriorado' | 'Requiere Mantenimiento'>('Buen Estado');
  const [returnNotes, setReturnNotes] = useState('');

  // Available resources to loan (Status must be "Disponible")
  const availableResources = resources.filter(r => r.status === 'Disponible');

  const filteredLoans = loans.filter(l => {
    const matchesTab = activeTab === 'activos' ? l.status === 'Activo' : l.status !== 'Activo';
    const matchesSearch =
      l.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.firefighterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.shift.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOpenCreate = () => {
    if (availableResources.length === 0) {
      addToast('warning', 'Sin Equipos Libres', 'No hay recursos con estado Disponible para prestar.');
      return;
    }
    setFormData({
      resourceId: availableResources[0]?.id || '',
      firefighterName: currentUser.fullName,
      firefighterRank: currentUser.rank,
      shift: SHIFTS[0],
      expectedReturnDate: '2026-11-08 20:30',
      notes: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resourceId) {
      addToast('error', 'Selección requerida', 'Debe seleccionar un equipo disponible.');
      return;
    }
    const res = createLoan(formData);
    if (res.success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningLoan) return;
    const res = returnLoan(returningLoan.id, returnCondition, returnNotes);
    if (res.success) {
      setReturningLoan(null);
      setReturnNotes('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Control de Asignaciones y Préstamos de Guardia
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              CRUD 2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Trazabilidad nominal de EPP, mangueras y herramientas durante las guardias operativas en cuartel.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-900/40 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Préstamo</span>
        </button>
      </div>

      {/* Tabs & Search Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('activos')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'activos'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Préstamos Activos ({loans.filter(l => l.status === 'Activo').length})
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'historial'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Historial de Devoluciones ({loans.filter(l => l.status !== 'Activo').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código, bombero o equipo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Loans Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLoans.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm bg-slate-900/60 rounded-2xl border border-slate-800">
            {activeTab === 'activos'
              ? 'No hay préstamos activos en este momento. Todo el equipo está en almacén.'
              : 'No se encontraron registros en el historial de devoluciones.'}
          </div>
        ) : (
          filteredLoans.map(loan => {
            const isLoanActive = loan.status === 'Activo';

            return (
              <div
                key={loan.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {loan.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        loan.status === 'Activo'
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                          : loan.status === 'Devuelto'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {loan.resourceName}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Recurso: {loan.resourceCode}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        <strong className="text-white">{loan.firefighterName}</strong> ({loan.firefighterRank})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{loan.shift}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Salida: {loan.loanDate}</span>
                    </div>

                    {loan.actualReturnDate && (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Devuelto: {loan.actualReturnDate} ({loan.conditionIn})</span>
                      </div>
                    )}

                    {loan.notes && (
                      <div className="p-2 rounded-lg bg-slate-950/60 text-[11px] text-slate-300 italic border border-slate-800/80">
                        {loan.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {isLoanActive ? (
                    <button
                      onClick={() => setReturningLoan(loan)}
                      className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-950/40 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Registrar Devolución</span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completado en almacén</span>
                    </div>
                  )}

                  {currentUser.role === 'admin_logistica' && (
                    <button
                      onClick={() => deleteLoan(loan.id)}
                      title="Anular registro de préstamo"
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal: Nuevo Préstamo */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">
                  Registrar Asignación / Salida de Guardia
                </h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              
              {/* Select Available Resource */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Equipo o Recurso a Asignar *
                </label>
                <select
                  required
                  value={formData.resourceId}
                  onChange={e => setFormData({ ...formData, resourceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {availableResources.map(r => (
                    <option key={r.id} value={r.id}>
                      [{r.code}] {r.name} ({r.location})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Al confirmar, el recurso cambiará su estado a <span className="text-sky-400 font-bold">&quot;En Uso&quot;</span> automáticamente.
                </p>
              </div>

              {/* Firefighter Name & Rank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Bombero Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firefighterName}
                    onChange={e => setFormData({ ...formData, firefighterName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Grado / Rango Bomberil *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firefighterRank}
                    onChange={e => setFormData({ ...formData, firefighterRank: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Shift & Return date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Turno de Guardia *
                  </label>
                  <select
                    value={formData.shift}
                    onChange={e => setFormData({ ...formData, shift: e.target.value as ShiftType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {SHIFTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Retorno Esperado
                  </label>
                  <input
                    type="text"
                    value={formData.expectedReturnDate}
                    onChange={e => setFormData({ ...formData, expectedReturnDate: e.target.value })}
                    placeholder="YYYY-MM-DD HH:mm"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Motivo de Salida / Incidente
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ej. Salida de autobomba a incendio de vivienda en Paucarpata..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-900/40"
                >
                  Confirmar Préstamo
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Devolución */}
      {returningLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Recepción y Devolución</h3>
                <p className="text-xs text-slate-400">Código de asignación: {returningLoan.code}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
              <div><strong className="text-slate-300">Recurso:</strong> {returningLoan.resourceName}</div>
              <div><strong className="text-slate-300">Retirado por:</strong> {returningLoan.firefighterName}</div>
              <div><strong className="text-slate-300">Guardia:</strong> {returningLoan.shift}</div>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Condición Física en que se Devuelve *
                </label>
                <select
                  value={returnCondition}
                  onChange={e => setReturnCondition(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Óptimo">Óptimo (Limpio y listo para uso)</option>
                  <option value="Buen Estado">Buen Estado (Operativo)</option>
                  <option value="Deteriorado">Deteriorado (Requiere revisión)</option>
                  <option value="Requiere Mantenimiento">Requiere Mantenimiento (Derivar a Taller)</option>
                </select>
                {returnCondition === 'Requiere Mantenimiento' && (
                  <p className="text-[11px] text-amber-400 mt-1">
                    Nota: El recurso pasará automáticamente a estado <span className="font-bold">&quot;En Mantenimiento&quot;</span>.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Novedades / Observaciones de Retorno
                </label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  placeholder="Detallar si se lavó el equipo, si perdió presión, si sufrió rasgadura..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReturningLoan(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-900/40"
                >
                  Confirmar Recepción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
