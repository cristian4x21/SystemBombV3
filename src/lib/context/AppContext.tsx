'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resource, Loan, Maintenance, User, AuditLog, UserRole } from '@/types';
import { INITIAL_USERS, INITIAL_RESOURCES, INITIAL_LOANS, INITIAL_MAINTENANCE, INITIAL_AUDIT_LOGS } from '@/lib/initialData';

export type ActiveTab = 'dashboard' | 'inventory' | 'loans' | 'maintenance' | 'audit' | 'security';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Resources (CRUD 1)
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string };
  updateResource: (id: string, resource: Partial<Resource>) => { success: boolean; error?: string };
  deleteResource: (id: string) => { success: boolean; error?: string };
  
  // Loans (CRUD 2)
  loans: Loan[];
  createLoan: (loanData: {
    resourceId: string;
    firefighterName: string;
    firefighterRank: string;
    shift: any;
    expectedReturnDate: string;
    notes?: string;
  }) => { success: boolean; error?: string };
  returnLoan: (loanId: string, conditionIn: 'Óptimo' | 'Buen Estado' | 'Deteriorado' | 'Requiere Mantenimiento', notes?: string) => { success: boolean; error?: string };
  deleteLoan: (id: string) => { success: boolean; error?: string };
  
  // Maintenance (CRUD 3)
  maintenanceList: Maintenance[];
  addMaintenance: (item: Omit<Maintenance, 'id'>) => { success: boolean; error?: string };
  updateMaintenance: (id: string, updates: Partial<Maintenance>) => { success: boolean; error?: string };
  deleteMaintenance: (id: string) => { success: boolean; error?: string };
  
  // Audit Logs
  auditLogs: AuditLog[];
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
  
  // Export
  exportInventoryCSV: () => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>(INITIAL_MAINTENANCE);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from local storage on mount (browser only)
  useEffect(() => {
    try {
      const savedRes = localStorage.getItem('systembomb_resources');
      const savedLoans = localStorage.getItem('systembomb_loans');
      const savedMnt = localStorage.getItem('systembomb_maintenance');
      const savedLogs = localStorage.getItem('systembomb_logs');
      const savedUser = localStorage.getItem('systembomb_user');

      if (savedRes) setResources(JSON.parse(savedRes));
      if (savedLoans) setLoans(JSON.parse(savedLoans));
      if (savedMnt) setMaintenanceList(JSON.parse(savedMnt));
      if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch {
      // fallback to defaults
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('systembomb_resources', JSON.stringify(resources));
      localStorage.setItem('systembomb_loans', JSON.stringify(loans));
      localStorage.setItem('systembomb_maintenance', JSON.stringify(maintenanceList));
      localStorage.setItem('systembomb_logs', JSON.stringify(auditLogs));
      localStorage.setItem('systembomb_user', JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [resources, loans, maintenanceList, auditLogs, currentUser]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const logAction = (action: AuditLog['action'], entity: string, details: string) => {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 8),
      timestamp,
      user: currentUser.fullName,
      role: currentUser.role,
      action,
      entity,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const user = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(user);
    logAction('LOGIN', 'Sesión de Usuario', `Cambio de perfil activo a ${user.fullName} (${user.rank})`);
    addToast('info', 'Perfil Cambiado', `Ahora navega con permisos de: ${user.rank}`);
  };

  // CRUD 1: Resources
  const addResource = (data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Validation
    if (!data.code.trim() || !data.name.trim()) {
      addToast('error', 'Error de Validación', 'El código institucional y el nombre del recurso son obligatorios.');
      return { success: false, error: 'Campos requeridos faltantes' };
    }

    const codeExists = resources.some(r => r.code.toUpperCase() === data.code.toUpperCase().trim());
    if (codeExists) {
      addToast('error', 'Código Duplicado', `El código institucional '${data.code}' ya se encuentra registrado.`);
      return { success: false, error: 'Código duplicado' };
    }

    const now = new Date().toISOString().substring(0, 10);
    const newResource: Resource = {
      ...data,
      id: 'res-' + Math.random().toString(36).substring(2, 8),
      code: data.code.toUpperCase().trim(),
      createdAt: now,
      updatedAt: now
    };

    setResources(prev => [newResource, ...prev]);
    logAction('CREACIÓN', `Recurso ${newResource.code}`, `Alta de recurso: ${newResource.name} en ${newResource.location}`);
    addToast('success', 'Recurso Registrado', `Se agregó '${newResource.name}' al catálogo oficial.`);
    return { success: true };
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    const target = resources.find(r => r.id === id);
    if (!target) return { success: false, error: 'Recurso no encontrado' };

    const now = new Date().toISOString().substring(0, 10);
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: now } : r));
    logAction('ACTUALIZACIÓN', `Recurso ${target.code}`, `Modificación de datos del equipo: ${target.name}`);
    addToast('success', 'Recurso Actualizado', `Cambios guardados correctamente para '${target.name}'.`);
    return { success: true };
  };

  const deleteResource = (id: string) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Acceso Denegado', 'Solo el Administrador de Logística tiene autorización para dar de baja recursos.');
      return { success: false, error: 'Permisos insuficientes' };
    }

    const target = resources.find(r => r.id === id);
    if (!target) return { success: false, error: 'Recurso no encontrado' };

    setResources(prev => prev.filter(r => r.id !== id));
    logAction('ELIMINACIÓN', `Recurso ${target.code}`, `Baja del inventario institucional: ${target.name}`);
    addToast('warning', 'Baja Registrada', `Se retiró el recurso '${target.name}' del inventario activo.`);
    return { success: true };
  };

  // CRUD 2: Loans
  const createLoan = (loanData: {
    resourceId: string;
    firefighterName: string;
    firefighterRank: string;
    shift: any;
    expectedReturnDate: string;
    notes?: string;
  }) => {
    const resource = resources.find(r => r.id === loanData.resourceId);
    if (!resource) {
      addToast('error', 'Error', 'El recurso seleccionado no existe.');
      return { success: false, error: 'Recurso inexistente' };
    }

    if (resource.status !== 'Disponible') {
      addToast('error', 'Recurso No Disponible', `El equipo '${resource.name}' se encuentra actualmente ${resource.status}.`);
      return { success: false, error: 'Recurso no disponible' };
    }

    const now = new Date();
    const loanDate = now.toISOString().replace('T', ' ').substring(0, 16);
    const loanCode = `ASG-2026-${String(loans.length + 42).padStart(3, '0')}`;

    const newLoan: Loan = {
      id: 'loan-' + Math.random().toString(36).substring(2, 8),
      code: loanCode,
      resourceId: resource.id,
      resourceCode: resource.code,
      resourceName: resource.name,
      firefighterName: loanData.firefighterName,
      firefighterRank: loanData.firefighterRank,
      shift: loanData.shift,
      loanDate,
      expectedReturnDate: loanData.expectedReturnDate,
      conditionOut: 'Óptimo',
      status: 'Activo',
      notes: loanData.notes || ''
    };

    // Update resource status to "En Uso"
    setResources(prev => prev.map(r => r.id === resource.id ? { ...r, status: 'En Uso' } : r));
    setLoans(prev => [newLoan, ...prev]);

    logAction('PRÉSTAMO', `Asignación ${loanCode}`, `Préstamo de ${resource.name} a ${loanData.firefighterName} (${loanData.shift})`);
    addToast('success', 'Préstamo Registrado', `Asignación confirmada. El equipo figura ahora como 'En Uso'.`);
    return { success: true };
  };

  const returnLoan = (loanId: string, conditionIn: 'Óptimo' | 'Buen Estado' | 'Deteriorado' | 'Requiere Mantenimiento', notes?: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return { success: false, error: 'Préstamo no encontrado' };

    const now = new Date();
    const actualReturnDate = now.toISOString().replace('T', ' ').substring(0, 16);
    const newStatus = (conditionIn === 'Requiere Mantenimiento' || conditionIn === 'Deteriorado') ? 'Observado' : 'Devuelto';
    const newResourceStatus = (conditionIn === 'Requiere Mantenimiento') ? 'En Mantenimiento' : 'Disponible';

    setLoans(prev => prev.map(l => l.id === loanId ? {
      ...l,
      actualReturnDate,
      conditionIn,
      status: newStatus,
      notes: notes ? (l.notes ? `${l.notes} | Retorno: ${notes}` : `Retorno: ${notes}`) : l.notes
    } : l));

    // Update resource state
    setResources(prev => prev.map(r => r.id === loan.resourceId ? { ...r, status: newResourceStatus } : r));

    logAction('DEVOLUCIÓN', `Asignación ${loan.code}`, `Recepción de ${loan.resourceName} con condición '${conditionIn}'. Estado de recurso: '${newResourceStatus}'.`);
    addToast('success', 'Equipo Devuelto', `Recepción procesada. El equipo vuelve a estar '${newResourceStatus}'.`);
    return { success: true };
  };

  const deleteLoan = (id: string) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Acceso Denegado', 'Solo el Administrador puede anular registros de asignación.');
      return { success: false, error: 'Permisos insuficientes' };
    }
    const target = loans.find(l => l.id === id);
    if (!target) return { success: false, error: 'Préstamo no encontrado' };

    setLoans(prev => prev.filter(l => l.id !== id));
    logAction('ELIMINACIÓN', `Asignación ${target.code}`, `Anulación de registro de asignación`);
    addToast('warning', 'Préstamo Anulado', `Se eliminó el registro de préstamo ${target.code}.`);
    return { success: true };
  };

  // CRUD 3: Maintenance
  const addMaintenance = (data: Omit<Maintenance, 'id'>) => {
    const newMnt: Maintenance = {
      ...data,
      id: 'mnt-' + Math.random().toString(36).substring(2, 8)
    };
    setMaintenanceList(prev => [newMnt, ...prev]);
    logAction('CREACIÓN', `Mantenimiento ${newMnt.code}`, `Programación para ${newMnt.equipmentName} (${newMnt.maintenanceType})`);
    addToast('success', 'Mantenimiento Programado', `Orden registrada para ${newMnt.equipmentName}.`);
    return { success: true };
  };

  const updateMaintenance = (id: string, updates: Partial<Maintenance>) => {
    const target = maintenanceList.find(m => m.id === id);
    if (!target) return { success: false, error: 'Mantenimiento no encontrado' };

    setMaintenanceList(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    logAction('ACTUALIZACIÓN', `Mantenimiento ${target.code}`, `Actualización de estado a ${updates.status || target.status}`);
    addToast('success', 'Mantenimiento Actualizado', `Cambios registrados para ${target.equipmentName}.`);
    return { success: true };
  };

  const deleteMaintenance = (id: string) => {
    if (currentUser.role !== 'admin_logistica') {
      addToast('error', 'Acceso Denegado', 'Solo el Administrador puede eliminar órdenes técnicas.');
      return { success: false, error: 'Permisos insuficientes' };
    }
    const target = maintenanceList.find(m => m.id === id);
    if (!target) return { success: false, error: 'No encontrado' };

    setMaintenanceList(prev => prev.filter(m => m.id !== id));
    logAction('ELIMINACIÓN', `Mantenimiento ${target.code}`, `Cancelación de orden técnica de ${target.equipmentName}`);
    addToast('warning', 'Mantenimiento Eliminado', `Se canceló la orden ${target.code}.`);
    return { success: true };
  };

  // Export CSV
  const exportInventoryCSV = () => {
    const headers = ['Codigo', 'Nombre', 'Categoria', 'Ubicacion', 'Estado', 'Stock_Actual', 'Stock_Minimo', 'Fecha_Inspeccion', 'Serie'];
    const rows = resources.map(r => [
      `"${r.code}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.location}"`,
      `"${r.status}"`,
      r.stockActual,
      r.stockMinimo,
      `"${r.inspectionDate}"`,
      `"${r.serialNumber || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventario_B233_VirgenDeChapi_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('info', 'Reporte Exportado', 'Se descargó el archivo CSV con el inventario completo.');
  };

  const resetToInitialData = () => {
    setResources(INITIAL_RESOURCES);
    setLoans(INITIAL_LOANS);
    setMaintenanceList(INITIAL_MAINTENANCE);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(INITIAL_USERS[0]);
    localStorage.clear();
    addToast('info', 'Datos Restaurados', 'Se cargaron los datos iniciales de la B-233.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        activeTab,
        setActiveTab,
        resources,
        addResource,
        updateResource,
        deleteResource,
        loans,
        createLoan,
        returnLoan,
        deleteLoan,
        maintenanceList,
        addMaintenance,
        updateMaintenance,
        deleteMaintenance,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        exportInventoryCSV,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
