export interface OperatorCertification {
  id: string;
  rut: string;
  nombre: string;
  cargo: string;
  faenaAsignada: string;
  equipoAsignado: string;
  telefono: string;
  licenciaClase: string;          // e.g. "Clase D / A4"
  licenciaVencimiento: string;    // YYYY-MM-DD
  licenciaEstado: 'Al Día' | 'Por Vencer' | 'Vencida';
  examenOcupacional: string;      // e.g. "Gran Altura Geográfica (4.500 msnm)"
  examenVencimiento: string;      // YYYY-MM-DD
  examenEstado: 'Al Día' | 'Por Vencer' | 'Vencida';
  certificacionTecnica: string;   // e.g. "Certificación Rigger & Grúa Liebherr"
  certificacionVencimiento: string;
  certificacionEstado: 'Al Día' | 'Por Vencer' | 'Vencida';
  diasParaProximoVencimiento: number;
}
