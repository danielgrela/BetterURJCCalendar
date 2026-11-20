import { AULA_SIN_ASIGNAR, CAMPOS_DESCRIPCION } from './formatoICS';
import { normalizarAula } from './handleExcel';
import { desdeZona, enMadrid, type HoraLocal } from './horaMadrid';
import type { Examen } from '../types/examen';

// Lee un .ics (RFC 5545) y devuelve los exámenes con el mismo formato que handleExcel.
// Con un .ics exportado por la app se recuperan todos los campos de la descripción; con uno
// de otro calendario se rellena lo que se pueda deducir y se descartan los eventos sin hora,
// porque el resto de la app necesita "HH:MM - HH:MM".

const ERROR_LECTURA = 'No se ha podido leer el archivo. Comprueba que es un calendario .ics y que no está dañado.';
const ERROR_SIN_EXAMENES = 'No se ha encontrado ningún examen en el archivo .ics. Tiene que tener eventos con fecha y hora, como el que exporta Better URJC Calendar.';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface Propiedad {
  parametros: Record<string, string>;
  valor: string;
}

type Evento = Map<string, Propiedad>;

const dosCifras = (n: number) => String(n).padStart(2, '0');

// Las líneas largas se pliegan en varias que empiezan por espacio o tabulador
const lineas = (texto: string) => texto.replace(/\r?\n[ \t]/g, '').split(/\r?\n/);

// "DTSTART;TZID=Europe/Madrid:20260511T170000" → nombre, parámetros y valor. Los ':' entre
// comillas son parte de un parámetro, no el separador del valor
function leerLinea(linea: string): [string, Propiedad] | null {
  let separador = -1;
  let entreComillas = false;
  for (let i = 0; i < linea.length; i++) {
    if (linea[i] === '"') entreComillas = !entreComillas;
    else if (linea[i] === ':' && !entreComillas) { separador = i; break; }
  }
  if (separador === -1) return null;
  const [nombre, ...parametros] = linea.slice(0, separador).split(';');
  return [nombre.toUpperCase(), {
    parametros: Object.fromEntries(parametros.map((p) => {
      const [clave, ...valor] = p.split('=');
      return [clave.toUpperCase(), valor.join('=').replace(/^"|"$/g, '')];
    })),
    valor: linea.slice(separador + 1),
  }];
}

const desescapar = (valor: string) => valor.replace(/\\([\\;,nN])/g, (_, c: string) => (c === 'n' || c === 'N' ? '\n' : c));

// Solo cuentan las propiedades del VEVENT, no las de un VALARM u otro bloque que lleve dentro
function leerEventos(texto: string): Evento[] {
  const eventos: Evento[] = [];
  let actual: Evento | null = null;
  let anidados = 0;
  for (const linea of lineas(texto)) {
    const leida = leerLinea(linea);
    if (!leida) continue;
    const [nombre, propiedad] = leida;
    const bloque = propiedad.valor.trim().toUpperCase();
    if (nombre === 'BEGIN' && bloque === 'VEVENT') { actual = new Map(); anidados = 0; }
    else if (nombre === 'END' && bloque === 'VEVENT') { if (actual) eventos.push(actual); actual = null; }
    else if (actual && nombre === 'BEGIN') anidados++;
    else if (actual && nombre === 'END') anidados--;
    else if (actual && anidados === 0 && !actual.has(nombre)) actual.set(nombre, propiedad);
  }
  return eventos;
}

// Fecha y hora en Madrid. UTC ("Z") y TZID se convierten; sin zona es hora flotante y se toma
// tal cual, igual que un TZID que no sea IANA. Un evento de día entero (solo fecha) da null
function fechaHora(propiedad: Propiedad | undefined): HoraLocal | null {
  const partes = propiedad?.valor.trim().match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})\d{0,2}(Z?)$/);
  if (!partes) return null;
  const [anio, mes, dia, hora, minuto] = partes.slice(1, 6).map(Number);
  const local: HoraLocal = { anio, mes, dia, hora, minuto };
  if (partes[6] === 'Z') return enMadrid(new Date(Date.UTC(anio, mes - 1, dia, hora, minuto)));
  const zona = propiedad?.parametros.TZID;
  if (!zona) return local;
  try {
    return enMadrid(desdeZona(local, zona));
  } catch {
    return local;
  }
}

// "PT2H", "PT1H30M"… → minutos; los eventos sin DTEND pueden traer DURATION en su lugar
function minutosDe(duracion: string | undefined): number {
  const partes = duracion?.trim().match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?/);
  if (!partes) return 0;
  const [dias, horas, minutos] = partes.slice(1).map((n) => Number(n ?? 0));
  return dias * 1440 + horas * 60 + minutos;
}

const horaTexto = ({ hora, minuto }: HoraLocal) => `${dosCifras(hora)}:${dosCifras(minuto)}`;

// Los códigos de plan y asignatura son números en el Excel de la URJC
const codigo = (texto: string): number | string => (/^\d+$/.test(texto) ? Number(texto) : texto);

// Última cifra entre paréntesis: "BASES DE DATOS (2034011)" → "2034011"
const ultimoCodigo = (texto: string) => [...texto.matchAll(/\((\d+)\)/g)].at(-1)?.[1] ?? '';
const primerCodigo = (texto: string) => texto.match(/\((\d+)\)/)?.[1] ?? '';

// Líneas «Etiqueta: valor» de la descripción
function camposDescripcion(descripcion: string): Map<string, string> {
  const campos = new Map<string, string>();
  for (const linea of descripcion.split('\n')) {
    const separador = linea.indexOf(': ');
    if (separador > 0) campos.set(linea.slice(0, separador).trim(), linea.slice(separador + 2).trim());
  }
  return campos;
}

function eventoAExamen(evento: Evento): Examen | null {
  const asignatura = desescapar(evento.get('SUMMARY')?.valor ?? '').trim();
  const inicio = fechaHora(evento.get('DTSTART'));
  if (!asignatura || !inicio) return null;
  const fin = fechaHora(evento.get('DTEND'))
    ?? enMadrid(new Date(desdeZona(inicio, 'Europe/Madrid').getTime() + minutosDe(evento.get('DURATION')?.valor) * 60000));

  const campos = camposDescripcion(desescapar(evento.get('DESCRIPTION')?.valor ?? ''));
  const deLaDescripcion = Object.fromEntries(
    CAMPOS_DESCRIPCION.map(({ etiqueta, campo }) => [campo, campos.get(etiqueta)]),
  ) as Partial<Record<(typeof CAMPOS_DESCRIPCION)[number]['campo'], string>>;

  // Formato de antes de que la descripción llevara todas las columnas: "Curso: 3/BT (Grupo BT)"
  const cursoAntiguo = campos.get('Curso')?.match(/^(.*?)(?: \(Grupo (.*)\))?$/);
  const curso = deLaDescripcion.Curso ?? cursoAntiguo?.[1] ?? '';
  const plan = deLaDescripcion.Plan ?? '';
  const lugar = desescapar(evento.get('LOCATION')?.valor ?? '').trim();

  return {
    Curso: curso,
    Plan: plan,
    Asignatura: asignatura,
    CodigoPlan: codigo(deLaDescripcion.CodigoPlan ?? primerCodigo(plan)),
    CodigoAsignatura: codigo(deLaDescripcion.CodigoAsignatura ?? ultimoCodigo(asignatura)),
    CodigoGrupo: deLaDescripcion.CodigoGrupo ?? cursoAntiguo?.[2] ?? curso.split('/')[1] ?? '',
    // En un .ics ajeno se usa el mes del examen, que coincide con las convocatorias de la URJC
    Convocatoria: deLaDescripcion.Convocatoria || MESES[inicio.mes - 1],
    Fecha: `${dosCifras(inicio.dia)}-${dosCifras(inicio.mes)}-${inicio.anio}`,
    Hora: `${horaTexto(inicio)} - ${horaTexto(fin)}`,
    Aula: lugar === AULA_SIN_ASIGNAR ? '-' : normalizarAula(lugar),
  };
}

export function icsAExamenes(texto: string): Examen[] {
  if (!/^BEGIN:VCALENDAR/im.test(texto)) throw new Error(ERROR_LECTURA);
  const examenes = leerEventos(texto).map(eventoAExamen).filter((ev): ev is Examen => ev !== null);
  if (examenes.length === 0) throw new Error(ERROR_SIN_EXAMENES);
  return examenes;
}

export default async function icsTojson(archivo: File): Promise<Examen[]> {
  let texto: string;
  try {
    texto = await archivo.text();
  } catch {
    throw new Error(ERROR_LECTURA);
  }
  return icsAExamenes(texto);
}
