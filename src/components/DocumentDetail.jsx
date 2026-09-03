import { TIPOS_DOCUMENTO } from "../services/documentosApi";

function nombreTipo(tipo) {
  return TIPOS_DOCUMENTO.find((t) => t.id === tipo)?.nombre || tipo;
}

/**
 * DocumentDetail.jsx — Visualización de un documento.
 * Responsabilidad: mostrar el detalle completo de un documento en un
 * diálogo modal, de solo lectura.
 * Información que recibe: { documento, onCerrar, onEditar }.
 * Relación con otros componentes: se abre desde DocumentList al elegir
 * "Ver"; ofrece un atajo directo a DocumentForm mediante onEditar.
 */
export function DocumentDetail({ documento, onCerrar, onEditar }) {
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="detalle-doc-titulo">
        <span className="badge">{nombreTipo(documento.tipo)}</span>
        <h2 id="detalle-doc-titulo" style={{ marginTop: "0.5rem" }}>
          {documento.titulo}
        </h2>
        <p style={{ color: "var(--color-ink-muted)", margin: "0 0 1rem 0" }}>
          Fecha: {documento.fecha}
        </p>
        <p>{documento.descripcion || "Sin descripción registrada."}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn-secondary" onClick={onCerrar}>
            Cerrar
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onEditar(documento)}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
