export interface ActivityItem {
  id: number;
  descripcion: string;
}

export interface HorometroData {
  inicial: string;
  final: string;
  totalHoras: string;
}

export interface FluidosData {
  combustible: string; // e.g., "40%"
  acMotor: string;     // e.g., "OK"
  acTransmision: string; // e.g., "OK"
  acHidraulico: string;  // e.g., "OK"
}

export interface ReportItem {
  id: string;              // e.g., "002532"
  codigo: string;          // e.g., "BG_COM_F003_002"
  faena: string;           // e.g., "SPENCE"
  maquina: string;         // e.g., "LTM 1250"
  fecha: string;           // e.g., "2026-08-01"
  operador: string;        // e.g., "RAUL SOLORZA"
  numeroEquipo: string;    // e.g., "#140"
  horaEntrada: string;     // e.g., "08:00"
  horaSalida: string;      // e.g., "20:00"
  totalTurno: string;      // e.g., "12"
  horometro: HorometroData;
  actividades: ActivityItem[];
  fluidos: FluidosData;
  observaciones: string;
  nombreSupervisor: string;
  firmaSupervisorUrl?: string; // base64 data URL
  firmaOperadorUrl?: string;   // base64 data URL
  tieneFirmaSupervisor: boolean;
  tieneFirmaOperador: boolean;
  estado: 'Borrador' | 'Pendiente V°B°' | 'Firmado' | 'Rechazado';
  createdAt: string;
}

export interface UserSession {
  id?: string;
  nombre: string;
  rol: 'Operador' | 'Supervisor' | 'Administrador' | 'Cliente' | 'Mecánico';
  cargo: string;
  email?: string;
  rut?: string;
}

export interface UserAccount {
  id: string;
  rut: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'Operador' | 'Supervisor' | 'Administrador' | 'Cliente' | 'Mecánico';
  cargo: string;
  faena: string;
  createdAt: string;
}


