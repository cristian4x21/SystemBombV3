'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Maintenance, MaintenanceType, MaintenanceStatus } from '@/types';
import {
  Wrench,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  DollarSign,
  User,
  X,
  Edit,
  Trash2,
  ShieldAlert,
  Search
} from 'lucide-react';

const MAINTENANCE_TYPES: MaintenanceType[] = [
  'Mantenimiento Preventivo',
  'Mantenimiento Correctivo',
  'Inspección Periódica',
  'Prueba Hidrostática NFPA'
];

export const MaintenanceView: React.FC = () => {
  const { maintenanceList, addMaintenance, updateMaintenance, deleteMaintenance, currentUser, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Maintenance | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    equipmentName: '',
    equipmentType: 'Unidad Autobomba' as any,
    maintenanceType: MAINTENANCE_TYPES[0],
    scheduledDate: '2026-11-15',
    technician: '',
    cost: 0,
    status: 'Programado' as MaintenanceStatus,
    priority: 'Media' as 'Alta' | 'Media' | 'Baja',
    observations: ''
  });

  const totalCost = maintenanceList.reduce((acc, m) => acc + (m.cost || 0), 0);

  const filteredMaintenance = maintenanceList.filter(m => {
    const matchesSearch =
      m.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Permiso Restringido', 'Solo el Administrador de Logística puede programar órdenes de mantenimiento.');
      return;
    }
    const nextCode = `MNT-2026-${String(maintenanceList.length + 19).padStart(3, '0')}`;
    setFormData({
      code: nextCode,
      equipmentName: '',
      equipmentType: 'Unidad Autobomba',
      maintenanceType: MAINTENANCE_TYPES[0],
      scheduledDate: '2026-11-15',
      technician: '',
      cost: 250,
      status: 'Programado',
      priority: 'Media',
      observations: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (item: Maintenance) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Permiso Restringido', 'Solo el Administrador puede editar órdenes técnicas.');
      return;
    }
    setEditingItem(item);
    setFormData({
      code: item.code,
      equipmentName: item.equipmentName,
      equipmentType: item.equipmentType,
      maintenanceType: item.maintenanceType,
      scheduledDate: item.scheduledDate,
      technician: item.technician,
      cost: item.cost,
      status: item.status,
      priority: item.priority,
      observations: item.observations
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equipmentName.trim() || !formData.technician.trim()) {
      addToast('error', 'Datos Incompletos', 'Indique el equipo o vehículo y el técnico responsable.');
      return;
    }
    const res = addMaintenance(formData);
    if (res.success) setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const res = updateMaintenance(editingItem.id, formData);
    if (res.success) setEditingItem(null);
  };

  const handleQuickStatusChange = (id: string, newStatus: MaintenanceStatus) => {
    const today = new Date().toISOString().substring(0, 10);
    updateMaintenance(id, {
      status: newStatus,
      completedDate: newStatus === 'Completado' ? today : undefined
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Flota Vehicular y Mantenimientos Técnicos
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              CRUD 3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inspecciones normadas NFPA, cambios de lubricantes en bombas de agua y pruebas mecánicas de la B-233.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-right">
            <div className="text-slate-400 font-medium">Inversión Logística</div>
            <div className="text-emerald-400 font-bold font-mono">S/. {totalCost.toFixed(2)} PEN</div>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-900/40 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Programar Orden</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por equipo, código o taller..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Programado">Programados</option>
            <option value="En Curso">En Curso / Taller</option>
            <option value="Completado">Completados</option>
          </select>
        </div>
      </div>

      {/* Maintenance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaintenance.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-sm bg-slate-900/60 rounded-2xl border border-slate-800">
            No hay órdenes de mantenimiento que coincidan con la búsqueda.
          </div>
        ) : (
          filteredMaintenance.map(mnt => {
            const statusConfig = {
              'Programado': { bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30', label: 'Programado' },
              'En Curso': { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', label: 'En Taller / Curso' },
              'Completado': { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'Completado' },
              'Vencido': { bg: 'bg-red-500/15 text-red-400 border-red-500/30', label: 'Vencido' }
            };

            const priorityBadge = {
              'Alta': 'bg-red-950/80 text-red-400 border-red-800/60',
              'Media': 'bg-amber-950/80 text-amber-400 border-amber-800/60',
              'Baja': 'bg-slate-800 text-slate-300 border-slate-700'
            };

            return (
              <div
                key={mnt.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-400">
                        {mnt.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${priorityBadge[mnt.priority]}`}>
                        Prioridad {mnt.priority}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig[mnt.status].bg}`}>
                      {statusConfig[mnt.status].label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {mnt.equipmentName}
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-500" />
                    <span>{mnt.maintenanceType}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Fecha: {mnt.scheduledDate}</span>
                      </div>
                      <div className="font-mono text-emerald-400 font-bold">
                        S/. {mnt.cost.toFixed(2)} PEN
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <User className="w-3.5 h-3.5" />
                      <span>Responsable: <strong className="text-slate-200">{mnt.technician}</strong></span>
                    </div>

                    {mnt.observations && (
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                        {mnt.observations}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Switcher & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {mnt.status !== 'Completado' && (
                      <button
                        onClick={() => handleQuickStatusChange(mnt.id, 'Completado')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Marcar Listo</span>
                      </button>
                    )}
                    {mnt.status === 'Programado' && (
                      <button
                        onClick={() => handleQuickStatusChange(mnt.id, 'En Curso')}
                        className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Iniciar Taller</span>
                      </button>
                    )}
                  </div>

                  {currentUser.role === 'admin_logistica' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(mnt)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Editar orden"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMaintenance(mnt.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40"
                        title="Eliminar orden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal: Crear / Editar Mantenimiento */}
      {(isCreateModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">
                  {editingItem ? `Editar Orden: ${editingItem.code}` : 'Programar Mantenimiento de Flota'}
                </h3>
              </div>
              <button onClick={() => { setIsCreateModalOpen(false); setEditingItem(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingItem ? handleEditSubmit : handleCreateSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Vehículo o Equipo Crítico *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.equipmentName}
                    onChange={e => setFormData({ ...formData, equipmentName: e.target.value })}
                    placeholder="Ej. Autobomba B-233 Spartan / Lote 6 Cilindros ERA"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Tipo de Mantenimiento *
                  </label>
                  <select
                    value={formData.maintenanceType}
                    onChange={e => setFormData({ ...formData, maintenanceType: e.target.value as MaintenanceType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {MAINTENANCE_TYPES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="Alta">Alta (Emergencia inmediata)</option>
                    <option value="Media">Media (Programada)</option>
                    <option value="Baja">Baja (Rutina)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Fecha Programada *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Costo Estimado (PEN)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Taller Mecánico o Técnico Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.technician}
                    onChange={e => setFormData({ ...formData, technician: e.target.value })}
                    placeholder="Ej. Taller Arequipa Diesel / Maquinista Luis Herrera"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Detalles del Servicio Técnico
                </label>
                <textarea
                  rows={2}
                  value={formData.observations}
                  onChange={e => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Especificar repuestos a cambiar, pruebas de presión o diagnóstico..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setEditingItem(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-900/40"
                >
                  {editingItem ? 'Guardar Cambios' : 'Registrar Orden'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
