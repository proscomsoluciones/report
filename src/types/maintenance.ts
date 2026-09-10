export type MaintenanceType = 'Preventiva' | 'Correctiva';
export type MaintenanceStatus = 'Completada' | 'En Taller' | 'Programada';

export interface EquipmentState {
  id: string;                      // e.g. "eq-140"
  numeroInterno: string;          // e.g. "#140"
  maquina: string;                // e.g. "LIEBHERR LTM 1250"
  faenaActual: string;            // e.g. "SPENCE"
  horometroActual: number;        // e.g. 218194.5
  horometroProximaMantencion: number; // e.g. 218250.0
  horasFaltantes: number;         // horometroProximaMantencion - horometroActual
  estado: 'Al Día' | 'Próxima' | 'Overdue' | 'En Taller';
  ultimaMantencionFecha: string;
}

export interface MaintenanceLogEntry {
  id: string;                     // e.g. "MNT-2026-089"
  equipoId: string;
  numeroInterno: string;
  maquina: string;
  tipo: MaintenanceType;
  categoria: 'Motor & Aceite' | 'Sistema Hidráulico' | 'Frenos & Transmisión' | 'Pluma & Telescópico' | 'Sistema Eléctrico';
  fecha: string;
  horometroServicio: number;
  mecanicoResponsable: string;
  taller: string;                 // e.g. "Taller Central Quilicura" | "Taller Móvil Spence"
  descripcion: string;
  repuestosUtilizados: string[];
  costoEstimadoClp: number;
  estado: MaintenanceStatus;
}
