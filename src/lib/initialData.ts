import { Resource, Loan, Maintenance, User, AuditLog } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-01',
    username: 'admin',
    fullName: 'Capitán CBP Carlos Mendoza',
    role: 'admin_logistica',
    rank: 'Primer Jefe de Compañía / Logística',
    email: 'logistica.b233@cgbvp.gob.pe',
    station: 'B-233 Virgen de Chapi - Paucarpata'
  },
  {
    id: 'usr-02',
    username: 'bombero',
    fullName: 'Seccionario CBP Diego Quispe',
    role: 'bombero_operativo',
    rank: 'Bombero Operativo de Guardia',
    email: 'dquispe@cgbvp.gob.pe',
    station: 'B-233 Virgen de Chapi - Paucarpata'
  },
  {
    id: 'usr-03',
    username: 'maquinista',
    fullName: 'Subteniente CBP Luis Herrera',
    role: 'admin_logistica',
    rank: 'Maquinista Jefe de Flota',
    email: 'lherrera@cgbvp.gob.pe',
    station: 'B-233 Virgen de Chapi - Paucarpata'
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-01',
    code: 'ERA-233-001',
    name: 'Equipo de Respiración Autónoma Draeger PSS 7000',
    category: 'Protección Respiratoria (ERA)',
    location: 'Autobomba B-233',
    status: 'Disponible',
    stockActual: 4,
    stockMinimo: 2,
    inspectionDate: '2026-12-15',
    serialNumber: 'DRG-PSS-8921',
    notes: 'Cilindro de fibra de carbono 4500 PSI. Prueba hidrostática vigente.',
    createdAt: '2026-09-01',
    updatedAt: '2026-11-05'
  },
  {
    id: 'res-02',
    code: 'EPP-233-014',
    name: 'Traje Estructural Completo Lion V-Force NFPA 1971',
    category: 'Protección Personal (EPP)',
    location: 'Almacén Central B-233',
    status: 'Disponible',
    stockActual: 12,
    stockMinimo: 5,
    inspectionDate: '2027-04-10',
    serialNumber: 'LION-VF-0044',
    notes: 'Capote y pantalón ignífugo con barrera térmica Gore-Tex.',
    createdAt: '2026-08-15',
    updatedAt: '2026-10-20'
  },
  {
    id: 'res-03',
    code: 'EXT-233-008',
    name: 'Herramienta de Extricación Hidráulica Holmatro Core (Cizalla)',
    category: 'Rescate y Extricación',
    location: 'Unidad Rescate R-233',
    status: 'En Uso',
    stockActual: 1,
    stockMinimo: 1,
    inspectionDate: '2026-11-28',
    serialNumber: 'HLM-COR-4100',
    notes: 'Asignada a guardia de rescate vehicular en Torrentera Los Incas.',
    createdAt: '2026-07-10',
    updatedAt: '2026-11-08'
  },
  {
    id: 'res-04',
    code: 'MNG-233-022',
    name: 'Manguera Doble Capa Sintética 1.5" x 50 pies (45mm)',
    category: 'Extinción de Incendios',
    location: 'Autobomba B-233',
    status: 'Disponible',
    stockActual: 8,
    stockMinimo: 4,
    inspectionDate: '2027-01-20',
    serialNumber: 'MNG-KOR-9912',
    notes: 'Acoples de aluminio forjado tipo Storz. Prueba de presión aprobada.',
    createdAt: '2026-08-01',
    updatedAt: '2026-11-02'
  },
  {
    id: 'res-05',
    code: 'PIT-233-005',
    name: 'Pitón Galonaje Variable Akron Brass Turbojet 1.5"',
    category: 'Extinción de Incendios',
    location: 'Cisterna C-233',
    status: 'Disponible',
    stockActual: 3,
    stockMinimo: 2,
    inspectionDate: '2026-11-12',
    serialNumber: 'AKR-TBJ-1720',
    notes: 'Flujo seleccionable 30-60-95-125 GPM. Válvula de bola inspeccionada.',
    createdAt: '2026-06-18',
    updatedAt: '2026-11-01'
  },
  {
    id: 'res-06',
    code: 'MED-233-019',
    name: 'Botiquín de Trauma Avanzado y Férula Espinal de Rescate',
    category: 'Atención Prehospitalaria',
    location: 'Ambulancia M-233',
    status: 'Disponible',
    stockActual: 2,
    stockMinimo: 3,
    inspectionDate: '2026-11-18',
    serialNumber: 'MED-TRM-3321',
    notes: 'Alerta: Requiere reposición de apósitos compresivos y collares Philadelphia.',
    createdAt: '2026-09-12',
    updatedAt: '2026-11-07'
  },
  {
    id: 'res-07',
    code: 'RAD-233-011',
    name: 'Radiotransmisor Portátil Banda VHF Motorola APX 2000',
    category: 'Comunicaciones y Señalización',
    location: 'Almacén Central B-233',
    status: 'En Mantenimiento',
    stockActual: 1,
    stockMinimo: 2,
    inspectionDate: '2026-11-02',
    serialNumber: 'MOT-APX-7719',
    notes: 'En taller de electrónica por falso contacto en conector de antena.',
    createdAt: '2026-05-10',
    updatedAt: '2026-11-06'
  },
  {
    id: 'res-08',
    code: 'MOT-233-003',
    name: 'Motosierra de Ventilación y Rescate Husqvarna 572XP',
    category: 'Rescate y Extricación',
    location: 'Autobomba B-233',
    status: 'Disponible',
    stockActual: 2,
    stockMinimo: 1,
    inspectionDate: '2027-02-15',
    serialNumber: 'HSQ-572-8812',
    notes: 'Cadena con puntas de carburo de tungsteno para techos y cortinas metálicas.',
    createdAt: '2026-08-25',
    updatedAt: '2026-10-30'
  }
];

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'loan-01',
    code: 'ASG-2026-041',
    resourceId: 'res-03',
    resourceCode: 'EXT-233-008',
    resourceName: 'Herramienta de Extricación Hidráulica Holmatro Core (Cizalla)',
    firefighterName: 'Subteniente CBP Luis Herrera',
    firefighterRank: 'Subteniente CBP',
    shift: 'Guardia Nocturna A',
    loanDate: '2026-11-08 08:30',
    expectedReturnDate: '2026-11-08 20:30',
    conditionOut: 'Óptimo',
    status: 'Activo',
    notes: 'Salida de apoyo a rescate en Carretera a Paucarpata km 4.'
  },
  {
    id: 'loan-02',
    code: 'ASG-2026-040',
    resourceId: 'res-01',
    resourceCode: 'ERA-233-001',
    resourceName: 'Equipo de Respiración Autónoma Draeger PSS 7000',
    firefighterName: 'Seccionario CBP Diego Quispe',
    firefighterRank: 'Seccionario CBP',
    shift: 'Guardia Diurna B',
    loanDate: '2026-11-07 07:00',
    expectedReturnDate: '2026-11-07 19:00',
    actualReturnDate: '2026-11-07 18:45',
    conditionOut: 'Óptimo',
    conditionIn: 'Buen Estado',
    status: 'Devuelto',
    notes: 'Utilizado en entrenamiento táctico de ventilación forzada.'
  },
  {
    id: 'loan-03',
    code: 'ASG-2026-039',
    resourceId: 'res-02',
    resourceCode: 'EPP-233-014',
    resourceName: 'Traje Estructural Completo Lion V-Force NFPA 1971',
    firefighterName: 'Subteniente CBP Carlos Mendoza',
    firefighterRank: 'Subteniente CBP',
    shift: 'Guardia Bravo',
    loanDate: '2026-11-06 19:00',
    expectedReturnDate: '2026-11-07 07:00',
    actualReturnDate: '2026-11-07 07:15',
    conditionOut: 'Óptimo',
    conditionIn: 'Buen Estado',
    status: 'Devuelto',
    notes: 'Descontaminación en lavadora industrial efectuada sin observaciones.'
  }
];

export const INITIAL_MAINTENANCE: Maintenance[] = [
  {
    id: 'mnt-01',
    code: 'MNT-2026-018',
    equipmentName: 'Autobomba B-233 (Spartan Gladiator 1500 GPM)',
    equipmentType: 'Unidad Autobomba',
    maintenanceType: 'Mantenimiento Preventivo',
    scheduledDate: '2026-11-15',
    technician: 'Taller Especializado Arequipa Diesel S.A.C.',
    cost: 1450.00,
    status: 'Programado',
    priority: 'Alta',
    observations: 'Cambio de aceite motor Cummins, purga de filtros de combustible e inspección de sellos mecánicos de la bomba Hale.'
  },
  {
    id: 'mnt-02',
    code: 'MNT-2026-017',
    equipmentName: 'Cisterna C-233 (Freightliner M2 - 3500 Galones)',
    equipmentType: 'Unidad Cisterna',
    maintenanceType: 'Inspección Periódica',
    scheduledDate: '2026-11-10',
    completedDate: '2026-11-10',
    technician: 'Maquinista Luis Herrera',
    cost: 320.00,
    status: 'Completado',
    priority: 'Media',
    observations: 'Revisión del sistema de frenos de aire y verificación de válvulas mariposa de descarga rápida.'
  },
  {
    id: 'mnt-03',
    code: 'MNT-2026-016',
    equipmentName: 'Lote de 6 Cilindros de Fibra ERA Draeger',
    equipmentType: 'Equipo ERA',
    maintenanceType: 'Prueba Hidrostática NFPA',
    scheduledDate: '2026-11-20',
    technician: 'Laboratorio de Pruebas Hidráulicas Sur',
    cost: 890.00,
    status: 'Programado',
    priority: 'Alta',
    observations: 'Certificación quinquenal obligatoria bajo norma NFPA 1852.'
  },
  {
    id: 'mnt-04',
    code: 'MNT-2026-015',
    equipmentName: 'Radiotransmisor Portátil VHF Motorola APX 2000',
    equipmentType: 'Herramienta Hidráulica',
    maintenanceType: 'Mantenimiento Correctivo',
    scheduledDate: '2026-11-04',
    technician: 'Comunicaciones Militares y Civiles E.I.R.L.',
    cost: 180.00,
    status: 'En Curso',
    priority: 'Media',
    observations: 'Reemplazo de conector SMA de antena y calibración de potencia de salida RF a 5 Watts.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-11-08 08:30:15',
    user: 'Capitán CBP Carlos Mendoza',
    role: 'admin_logistica',
    action: 'PRÉSTAMO',
    entity: 'Préstamo ASG-2026-041',
    details: 'Asignación de Cizalla Holmatro EXT-233-008 a Luis Herrera para Guardia Nocturna A'
  },
  {
    id: 'log-02',
    timestamp: '2026-11-07 18:45:22',
    user: 'Seccionario CBP Diego Quispe',
    role: 'bombero_operativo',
    action: 'DEVOLUCIÓN',
    entity: 'Préstamo ASG-2026-040',
    details: 'Devolución de ERA Draeger PSS 7000 en Buen Estado'
  },
  {
    id: 'log-03',
    timestamp: '2026-11-06 14:10:00',
    user: 'Subteniente CBP Luis Herrera',
    role: 'admin_logistica',
    action: 'CREACIÓN',
    entity: 'Mantenimiento MNT-2026-018',
    details: 'Programación de servicio mecánico preventivo para Autobomba B-233'
  }
];
