/**
 * documentosApi.js
 * -----------------------------------------------------------------------
 * Capa de acceso a datos del Gestor Documental.
 *
 * Punto 10 (consumo de endpoints) + Punto 11 (seguridad):
 * - Respeta el contrato acordado con el Backend (Evaluación Sumativa U2,
 *   Desarrollo Backend): GET/POST/PUT/DELETE sobre /api/documentos y
 *   GET /api/tipos-documento.
 * - Mientras el equipo de Backend no entregue una URL de despliegue,
 *   VITE_USE_MOCK=true activa un "servidor" simulado en memoria +
 *   localStorage que respeta EXACTAMENTE el mismo contrato (mismas rutas,
 *   mismos nombres de campo, mismos códigos de estado). Para integrar con
 *   el Backend real basta con cambiar VITE_API_BASE_URL en el archivo .env
 *   y VITE_USE_MOCK a "false" — ningún componente necesita cambiar.
 * - No se guardan credenciales ni tokens en el código fuente: la URL base
 *   y cualquier clave se leen desde variables de entorno (import.meta.env).
 * -----------------------------------------------------------------------
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") === "true";
const LATENCY_MS = 350;
const STORAGE_KEY = "gestor-documental:documentos:v1";

export const TIPOS_DOCUMENTO = [
  { id: "memo", nombre: "Memo" },
  { id: "oficio", nombre: "Oficio" },
  { id: "citacion", nombre: "Citación de apoderado" },
  { id: "acuerdo", nombre: "Acuerdo de apoderados" },
  { id: "reunion_comunal", nombre: "Documento de reunión comunal" },
  { id: "permiso", nombre: "Permiso administrativo" },
];

/** Clase de error de dominio: separa errores "esperables" (4xx) de fallas
 * técnicas, para no exponer detalles internos en la interfaz (punto 11). */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ------------------------------------------------------------------
// Semilla de datos de ejemplo (solo para el modo mock)
// ------------------------------------------------------------------
function semilla() {
  const hoy = new Date();
  const fecha = (diasAtras) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() - diasAtras);
    return d.toISOString().slice(0, 10);
  };
  return [
    {
      id: crypto.randomUUID(),
      titulo: "Memo N°12 - Reorganización de turnos de patio",
      tipo: "memo",
      fecha: fecha(2),
      descripcion: "Reasignación de turnos de vigilancia de patio para el segundo semestre.",
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      titulo: "Oficio N°04 - Solicitud de mantención eléctrica",
      tipo: "oficio",
      fecha: fecha(10),
      descripcion: "Solicitud dirigida al DAEM de María Pinto para revisión del tablero eléctrico.",
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      titulo: "Citación apoderados 6° básico",
      tipo: "citacion",
      fecha: fecha(1),
      descripcion: "Reunión de apoderados para tratar la salida pedagógica de octubre.",
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      titulo: "Acuerdo de apoderados - Financiamiento de material",
      tipo: "acuerdo",
      fecha: fecha(20),
      descripcion: "Acuerdo firmado sobre aporte voluntario para material de Artes Visuales.",
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      titulo: "Acta reunión comunal de directores - agosto",
      tipo: "reunion_comunal",
      fecha: fecha(15),
      descripcion: "Acta de la reunión mensual de directores de la comuna de María Pinto.",
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      titulo: "Permiso administrativo - Docente de Lenguaje",
      tipo: "permiso",
      fecha: fecha(5),
      descripcion: "Permiso administrativo de un día aprobado por dirección.",
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    },
  ];
}

function leerAlmacen() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const inicial = semilla();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
      return inicial;
    }
    return JSON.parse(raw);
  } catch {
    return semilla();
  }
}

function guardarAlmacen(lista) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  } catch {
    /* Falla silenciosa: en producción se reportaría a monitoreo. */
  }
}

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ------------------------------------------------------------------
// Validación de datos de entrada (punto 11 - seguridad)
// ------------------------------------------------------------------
export function validarDocumento(datos) {
  const errores = {};
  const titulo = (datos.titulo || "").trim();
  const tipo = (datos.tipo || "").trim();
  const fecha = (datos.fecha || "").trim();
  const descripcion = (datos.descripcion || "").trim();

  if (!titulo) errores.titulo = "El título es obligatorio.";
  else if (titulo.length > 150) errores.titulo = "El título no puede superar 150 caracteres.";

  if (!tipo) errores.tipo = "Debe seleccionar un tipo de documento.";
  else if (!TIPOS_DOCUMENTO.some((t) => t.id === tipo)) errores.tipo = "El tipo de documento no es válido.";

  if (!fecha) errores.fecha = "La fecha es obligatoria.";
  else if (Number.isNaN(Date.parse(fecha))) errores.fecha = "La fecha no es válida.";

  if (descripcion.length > 500) errores.descripcion = "La descripción no puede superar 500 caracteres.";

  return { esValido: Object.keys(errores).length === 0, errores };
}

// ------------------------------------------------------------------
// Cliente HTTP real (se activa con VITE_USE_MOCK=false)
// ------------------------------------------------------------------
async function solicitarHttp(path, options = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError("No fue posible conectar con el servidor. Intente nuevamente.", 0);
  }

  if (!respuesta.ok) {
    let mensaje = "Ocurrió un error al procesar la solicitud.";
    try {
      const cuerpo = await respuesta.json();
      if (cuerpo?.mensaje) mensaje = cuerpo.mensaje;
    } catch {
      /* cuerpo no era JSON; se usa el mensaje genérico */
    }
    throw new ApiError(mensaje, respuesta.status);
  }

  if (respuesta.status === 204) return null;
  return respuesta.json();
}

// ------------------------------------------------------------------
// API pública consumida por los componentes/hooks
// Contrato: GET /api/documentos, GET /api/documentos/{id},
// POST /api/documentos, PUT /api/documentos/{id},
// DELETE /api/documentos/{id}, GET /api/tipos-documento
// ------------------------------------------------------------------
export const documentosApi = {
  async listar({ busqueda = "", tipo = "" } = {}) {
    if (USE_MOCK) {
      await esperar(LATENCY_MS);
      let lista = leerAlmacen();
      if (tipo) lista = lista.filter((d) => d.tipo === tipo);
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        lista = lista.filter(
          (d) =>
            d.titulo.toLowerCase().includes(q) ||
            d.descripcion.toLowerCase().includes(q)
        );
      }
      return [...lista].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
    }
    const query = new URLSearchParams();
    if (busqueda) query.set("busqueda", busqueda);
    if (tipo) query.set("tipo", tipo);
    return solicitarHttp(`/documentos?${query.toString()}`);
  },

  async obtener(id) {
    if (USE_MOCK) {
      await esperar(LATENCY_MS);
      const doc = leerAlmacen().find((d) => d.id === id);
      if (!doc) throw new ApiError("El documento solicitado no existe.", 404);
      return doc;
    }
    return solicitarHttp(`/documentos/${id}`);
  },

  async crear(datos) {
    const { esValido, errores } = validarDocumento(datos);
    if (!esValido) throw new ApiError(Object.values(errores)[0], 422);

    if (USE_MOCK) {
      await esperar(LATENCY_MS);
      const lista = leerAlmacen();
      const nuevo = {
        id: crypto.randomUUID(),
        titulo: datos.titulo.trim(),
        tipo: datos.tipo,
        fecha: datos.fecha,
        descripcion: (datos.descripcion || "").trim(),
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      };
      lista.push(nuevo);
      guardarAlmacen(lista);
      return nuevo;
    }
    return solicitarHttp("/documentos", { method: "POST", body: JSON.stringify(datos) });
  },

  async actualizar(id, datos) {
    const { esValido, errores } = validarDocumento(datos);
    if (!esValido) throw new ApiError(Object.values(errores)[0], 422);

    if (USE_MOCK) {
      await esperar(LATENCY_MS);
      const lista = leerAlmacen();
      const indice = lista.findIndex((d) => d.id === id);
      if (indice === -1) throw new ApiError("El documento solicitado no existe.", 404);
      lista[indice] = {
        ...lista[indice],
        titulo: datos.titulo.trim(),
        tipo: datos.tipo,
        fecha: datos.fecha,
        descripcion: (datos.descripcion || "").trim(),
        actualizadoEn: new Date().toISOString(),
      };
      guardarAlmacen(lista);
      return lista[indice];
    }
    return solicitarHttp(`/documentos/${id}`, { method: "PUT", body: JSON.stringify(datos) });
  },

  async eliminar(id) {
    if (USE_MOCK) {
      await esperar(LATENCY_MS);
      const lista = leerAlmacen();
      const existe = lista.some((d) => d.id === id);
      if (!existe) throw new ApiError("El documento solicitado no existe.", 404);
      guardarAlmacen(lista.filter((d) => d.id !== id));
      return true;
    }
    await solicitarHttp(`/documentos/${id}`, { method: "DELETE" });
    return true;
  },

  async listarTipos() {
    if (USE_MOCK) {
      await esperar(120);
      return TIPOS_DOCUMENTO;
    }
    return solicitarHttp("/tipos-documento");
  },
};
