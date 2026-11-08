'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Resource, ResourceCategory, LocationType, ResourceStatus } from '@/types';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  Calendar,
  X,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';

const CATEGORIES: ResourceCategory[] = [
  'Protección Personal (EPP)',
  'Extinción de Incendios',
  'Rescate y Extricación',
  'Protección Respiratoria (ERA)',
  'Atención Prehospitalaria',
  'Comunicaciones y Señalización'
];

const LOCATIONS: LocationType[] = [
  'Almacén Central B-233',
  'Autobomba B-233',
  'Cisterna C-233',
  'Unidad Rescate R-233',
  'Ambulancia M-233',
  'Tópico y Trauma'
];

export const InventoryView: React.FC = () => {
  const { resources, addResource, updateResource, deleteResource, currentUser, addToast } = useApp();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: CATEGORIES[0],
    location: LOCATIONS[0],
    status: 'Disponible' as ResourceStatus,
    stockActual: 1,
    stockMinimo: 1,
    inspectionDate: '2026-11-08',
    serialNumber: '',
    notes: ''
  });

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch =
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (res.serialNumber && res.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (res.notes && res.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || res.status === selectedStatus;
      const matchesLoc = selectedLocation === 'ALL' || res.location === selectedLocation;

      return matchesSearch && matchesCat && matchesStatus && matchesLoc;
    });
  }, [resources, searchTerm, selectedCategory, selectedStatus, selectedLocation]);

  const handleOpenCreate = () => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Permiso Restringido', 'Solo el Administrador de Logística puede dar de alta nuevos recursos.');
      return;
    }
    const nextCodeNum = resources.length + 1;
    setFormData({
      code: `EQP-233-${String(nextCodeNum).padStart(3, '0')}`,
      name: '',
      category: CATEGORIES[0],
      location: LOCATIONS[0],
      status: 'Disponible',
      stockActual: 1,
      stockMinimo: 1,
      inspectionDate: new Date(Date.now() + 90 * 86400000).toISOString().substring(0, 10),
      serialNumber: '',
      notes: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (res: Resource) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Permiso Restringido', 'Solo el Administrador de Logística tiene autorización para editar recursos.');
      return;
    }
    setEditingResource(res);
    setFormData({
      code: res.code,
      name: res.name,
      category: res.category,
      location: res.location,
      status: res.status,
      stockActual: res.stockActual,
      stockMinimo: res.stockMinimo,
      inspectionDate: res.inspectionDate,
      serialNumber: res.serialNumber || '',
      notes: res.notes || ''
    });
  };

  const handleSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addResource(formData);
    if (result.success) {
      setIsCreateModalOpen(false);
    }
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    const result = updateResource(editingResource.id, formData);
    if (result.success) {
      setEditingResource(null);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingResource) return;
    deleteResource(deletingResource.id);
    setDeletingResource(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Inventario de Recursos y Equipamiento
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              CRUD 1 • {filteredResources.length} de {resources.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Control de EPP, mangueras, pitones, equipos ERA, herramientas hidráulicas e insumos de la B-233.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg shadow-red-900/40 transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Recurso</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Live Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por código, nombre, número de serie o nota..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="Disponible">Disponible</option>
              <option value="En Uso">En Uso</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="ALL">Todas las Ubicaciones</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Categoría:
          </span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-lg shrink-0 transition-all font-medium ${
              selectedCategory === 'ALL'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg shrink-0 transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Table / List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-200">
            <thead className="bg-slate-950/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Código</th>
                <th className="px-4 py-3.5">Recurso / Especificación</th>
                <th className="px-4 py-3.5">Categoría</th>
                <th className="px-4 py-3.5">Ubicación</th>
                <th className="px-4 py-3.5 text-center">Stock</th>
                <th className="px-4 py-3.5 text-center">Estado</th>
                <th className="px-4 py-3.5">Inspección</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No se encontraron recursos que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredResources.map(res => {
                  const statusColors = {
                    'Disponible': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
                    'En Uso': 'bg-sky-500/15 text-sky-400 border-sky-500/30',
                    'En Mantenimiento': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                    'Baja Lógica': 'bg-slate-700/50 text-slate-400 border-slate-600'
                  };

                  const isLowStock = res.stockActual <= res.stockMinimo;

                  return (
                    <tr key={res.id} className="hover:bg-slate-800/50 transition-colors">
                      
                      {/* Code */}
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-red-400">
                        {res.code}
                      </td>

                      {/* Name & Serial */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white">{res.name}</div>
                        {res.serialNumber && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            S/N: {res.serialNumber}
                          </div>
                        )}
                        {res.notes && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 italic">
                            {res.notes}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        {res.category}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{res.location}</span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isLowStock
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-200'
                        }`}>
                          {res.stockActual} / {res.stockMinimo} min
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[res.status]}`}>
                          {res.status}
                        </span>
                      </td>

                      {/* Inspection Date */}
                      <td className="px-4 py-3.5 text-xs text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{res.inspectionDate}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(res)}
                            title={currentUser.role === 'admin_logistica' ? 'Editar datos del recurso' : 'Solo Administrador'}
                            disabled={currentUser.role !== 'admin_logistica'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              currentUser.role === 'admin_logistica'
                                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                                : 'text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingResource(res)}
                            title={currentUser.role === 'admin_logistica' ? 'Dar de baja recurso' : 'Solo Administrador'}
                            disabled={currentUser.role !== 'admin_logistica'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              currentUser.role === 'admin_logistica'
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-950/60'
                                : 'text-slate-600 cursor-not-allowed'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Crear / Editar Recurso */}
      {(isCreateModalOpen || editingResource) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">
                  {editingResource ? `Editar Recurso: ${editingResource.code}` : 'Registrar Nuevo Recurso en Catálogo'}
                </h3>
              </div>
              <button
                onClick={() => { setIsCreateModalOpen(false); setEditingResource(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingResource ? handleSubmitEdit : handleSubmitCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Código Institucional *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ej. EPP-233-020"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Nombre del Recurso *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Pitón Akron 1.5 pulgadas"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Ubicación en Estación *
                  </label>
                  <select
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value as LocationType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {LOCATIONS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Stock Actual & Min */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockActual}
                    onChange={e => setFormData({ ...formData, stockActual: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Stock Mínimo de Alerta
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.stockMinimo}
                    onChange={e => setFormData({ ...formData, stockMinimo: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* Inspection Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Próxima Inspección Técnica
                  </label>
                  <input
                    type="date"
                    value={formData.inspectionDate}
                    onChange={e => setFormData({ ...formData, inspectionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Número de Serie / Lote
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Observaciones Técnicas
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Detalles sobre pruebas de presión, donante, estado del material..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setEditingResource(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-900/40"
                >
                  {editingResource ? 'Guardar Cambios' : 'Registrar en Inventario'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Baja Lógica */}
      {deletingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">¿Confirmar Baja de Recurso?</h3>
                <p className="text-xs text-slate-400">Esta acción retirará el recurso del inventario activo.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1">
              <div><strong className="text-slate-300">Código:</strong> <span className="font-mono text-red-400">{deletingResource.code}</span></div>
              <div><strong className="text-slate-300">Recurso:</strong> {deletingResource.name}</div>
              <div><strong className="text-slate-300">Ubicación actual:</strong> {deletingResource.location}</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingResource(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-900/40"
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
