export type UserRole = 'admin_logistica' | 'bombero_operativo';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  rank: string; // e.g. "Teniente CBP", "Seccionario CBP", "Subteniente CBP"
  email: string;
  station: string; // "B-233 Virgen de Chapi"
}

export type ResourceCategory = 
  | 'Protección Personal (EPP)'
  | 'Extinción de Incendios'
  | 'Rescate y Extricación'
  | 'Protección Respiratoria (ERA)'
  | 'Atención Prehospitalaria'
  | 'Comunicaciones y Señalización';

export type ResourceStatus = 
  | 'Disponible'
  | 'En Uso'
  | 'En Mantenimiento'
  | 'Baja Lógica';

export type LocationType = 
  | 'Almacén Central B-233'
  | 'Autobomba B-233'
  | 'Cisterna C-233'
  | 'Unidad Rescate R-233'
  | 'Ambulancia M-233'
  | 'Tópico y Trauma';

export interface Resource {
  id: string;
  code: string; // e.g. "EPP-233-014"
  name: string;
  category: ResourceCategory;
  location: LocationType;
  status: ResourceStatus;
  stockActual: number;
  stockMinimo: number;
  inspectionDate: string; // YYYY-MM-DD
  serialNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ShiftType = 
  | 'Guardia Nocturna A'
  | 'Guardia Diurna B'
  | 'Guardia Bravo'
  | 'Comisión de Servicio Especial';

export type LoanStatus = 'Activo' | 'Devuelto' | 'Observado';

export interface Loan {
  id: string;
  code: string; // e.g. "ASG-2026-089"
  resourceId: string;
  resourceCode: string;
  resourceName: string;
  firefighterName: string;
  firefighterRank: string;
  shift: ShiftType;
  loanDate: string; // YYYY-MM-DD HH:mm
  expectedReturnDate: string; // YYYY-MM-DD HH:mm
  actualReturnDate?: string;
  conditionOut: 'Óptimo' | 'Buen Estado' | 'Regular';
  conditionIn?: 'Óptimo' | 'Buen Estado' | 'Deteriorado' | 'Requiere Mantenimiento';
  status: LoanStatus;
  notes?: string;
}

export type MaintenanceType = 
  | 'Mantenimiento Preventivo'
  | 'Mantenimiento Correctivo'
  | 'Inspección Periódica'
  | 'Prueba Hidrostática NFPA';

export type MaintenanceStatus = 
  | 'Programado'
  | 'En Curso'
  | 'Completado'
  | 'Vencido';

export interface Maintenance {
  id: string;
  code: string; // e.g. "MNT-2026-012"
  equipmentName: string;
  equipmentType: 'Unidad Autobomba' | 'Unidad Cisterna' | 'Equipo ERA' | 'Herramienta Hidráulica' | 'Motobomba';
  maintenanceType: MaintenanceType;
  scheduledDate: string; // YYYY-MM-DD
  completedDate?: string;
  technician: string;
  cost: number;
  status: MaintenanceStatus;
  priority: 'Alta' | 'Media' | 'Baja';
  observations: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: 'CREACIÓN' | 'ACTUALIZACIÓN' | 'ELIMINACIÓN' | 'PRÉSTAMO' | 'DEVOLUCIÓN' | 'LOGIN';
  entity: string;
  details: string;
}
