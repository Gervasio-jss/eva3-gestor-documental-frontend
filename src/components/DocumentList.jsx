import { memo } from "react";
import { TIPOS_DOCUMENTO } from "../services/documentosApi";

function nombreTipo(tipo) {
  return TIPOS_DOCUMENTO.find((t) => t.id === tipo)?.nombre || tipo;
}

function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
}

/**
 * DocumentList.jsx — Listado de documentos.
 * Responsabilidad: renderizar la tabla de documentos y disparar las
 * acciones de ver, editar y eliminar. No conoce la lógica de red: recibe
 * los datos ya cargados por el componente padre.
 * Información que recibe: { documentos, cargando, onVer, onEditar, onEliminar }.
 * Relación con otros componentes: usado por DocumentosPage; sus acciones
 * abren DocumentDetail, DocumentForm o ConfirmDialog respectivamente.
 *
 * Punto 8 (optimización) — Optimización #2.
 * Situación inicial: al escribir en la búsqueda o abrir un modal, toda la
 * fila de la tabla — incluidas las filas que no cambiaron — se volvía a
 * renderizar en cada actualización de estado del componente padre.
 * Optimización aplicada: se envuelve el componente en React.memo, de modo
 * que una fila solo se vuelve a renderizar si sus propios props cambian.
 * Beneficio esperado: en listados de decenas de documentos evita cientos
 * de renderizados innecesarios de filas que no cambiaron.
 */
export function DocumentList({ documentos, cargando, onVer, onEditar, onEliminar }) {
  if (cargando) {
    return (
      <p role="status" aria-live="polite">
        Cargando documentos…
      </p>
    );
  }

  if (documentos.length === 0) {
    return (
      <div className="empty-state"roles="status" aria-live="polite">
        <p>No hay documentos que coincidan con la búsqueda o el filtro aplicado.</p>
      </div>
    );
  }

  return (
    <table className="doc-table">
      <caption>
  {documentos.length} {documentos.length === 1 ? "documento encontrado" : "documentos encontrados"}
</caption>
      <thead>
        <tr>
          <th scope="col">Título</th>
          <th scope="col">Tipo</th>
          <th scope="col">Fecha</th>
          <th scope="col">Descripción</th>
          <th scope="col">
            <span className="visually-hidden">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {documentos.map((doc) => (
          <FilaDocumento
            key={doc.id}
            documento={doc}
            onVer={onVer}
            onEditar={onEditar}
            onEliminar={onEliminar}
          />
        ))}
      </tbody>
    </table>
  );
}

const FilaDocumento = memo(function FilaDocumento({ documento, onVer, onEditar, onEliminar }) {
  return (
    <tr>
      <th scope="row" style={{ fontWeight: 500 }}>
        {documento.titulo}
      </th>
      <td>
        <span className="badge">{nombreTipo(documento.tipo)}</span>
      </td>
      <td>{formatearFecha(documento.fecha)}</td>
      <td>{documento.descripcion || "—"}</td>
      <td>
        <div className="row-actions">
          <button type="button" className="btn btn-secondary" onClick={() => onVer(documento)}>
            Ver<span className="visually-hidden"> {documento.titulo}</span>
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onEditar(documento)}>
            Editar<span className="visually-hidden"> {documento.titulo}</span>
          </button>
          <button type="button" className="btn btn-danger" onClick={() => onEliminar(documento)}>
            Eliminar<span className="visually-hidden"> {documento.titulo}</span>
          </button>
        </div>
      </td>
    </tr>
  );
});
