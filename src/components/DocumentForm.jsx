import { useEffect, useId, useState } from "react";
import { TIPOS_DOCUMENTO, validarDocumento } from "../services/documentosApi";

const VALORES_INICIALES = { titulo: "", tipo: "", fecha: "", descripcion: "" };

/**
 * DocumentForm.jsx — Formulario de creación/edición.
 * Responsabilidad: capturar y validar los datos de un documento antes de
 * enviarlos al componente padre. Valida en el cliente (feedback inmediato)
 * reutilizando la misma función de validación que usa la capa de datos,
 * para que las reglas nunca queden desincronizadas (punto 11 - seguridad).
 * Información que recibe: { documentoInicial?, onGuardar, onCancelar, guardando }.
 * Relación con otros componentes: usado por DocumentosPage tanto para
 * crear (documentoInicial=null) como para editar (documentoInicial=doc).
 */
export function DocumentForm({ documentoInicial, onGuardar, onCancelar, guardando }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const idBase = useId();

  useEffect(() => {
    setValores(
      documentoInicial
        ? {
            titulo: documentoInicial.titulo,
            tipo: documentoInicial.tipo,
            fecha: documentoInicial.fecha,
            descripcion: documentoInicial.descripcion,
          }
        : VALORES_INICIALES
    );
    setErrores({});
  }, [documentoInicial]);

  function actualizarCampo(campo, valor) {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  }

  function manejarEnvio(e) {
    e.preventDefault();
    const { esValido, errores: erroresValidacion } = validarDocumento(valores);
    setErrores(erroresValidacion);
    if (!esValido) return;
    onGuardar(valores);
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancelar()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={`${idBase}-titulo`}>
        <h2 id={`${idBase}-titulo`}>{documentoInicial ? "Editar documento" : "Nuevo documento"}</h2>
        <form onSubmit={manejarEnvio} noValidate>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor={`${idBase}-titulo-input`}>Título</label>
              <input
                id={`${idBase}-titulo-input`}
                type="text"
                value={valores.titulo}
                onChange={(e) => actualizarCampo("titulo", e.target.value)}
                aria-invalid={Boolean(errores.titulo)}
                aria-describedby={errores.titulo ? `${idBase}-titulo-error` : undefined}
                autoFocus
              />
              {errores.titulo && (
                <span id={`${idBase}-titulo-error`} className="field-error" role="alert">
                  {errores.titulo}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor={`${idBase}-tipo-input`}>Tipo de documento</label>
              <select
                id={`${idBase}-tipo-input`}
                value={valores.tipo}
                onChange={(e) => actualizarCampo("tipo", e.target.value)}
                aria-invalid={Boolean(errores.tipo)}
                aria-describedby={errores.tipo ? `${idBase}-tipo-error` : undefined}
              >
                <option value="">Seleccione…</option>
                {TIPOS_DOCUMENTO.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              {errores.tipo && (
                <span id={`${idBase}-tipo-error`} className="field-error" role="alert">
                  {errores.tipo}
                </span>
              )}
            </div>

            <div className="field">
              <label htmlFor={`${idBase}-fecha-input`}>Fecha</label>
              <input
                id={`${idBase}-fecha-input`}
                type="date"
                value={valores.fecha}
                onChange={(e) => actualizarCampo("fecha", e.target.value)}
                aria-invalid={Boolean(errores.fecha)}
                aria-describedby={errores.fecha ? `${idBase}-fecha-error` : undefined}
              />
              {errores.fecha && (
                <span id={`${idBase}-fecha-error`} className="field-error" role="alert">
                  {errores.fecha}
                </span>
              )}
            </div>

            <div className="field full">
              <label htmlFor={`${idBase}-descripcion-input`}>Descripción o referencia</label>
              <textarea
                id={`${idBase}-descripcion-input`}
                value={valores.descripcion}
                onChange={(e) => actualizarCampo("descripcion", e.target.value)}
                aria-invalid={Boolean(errores.descripcion)}
                aria-describedby={errores.descripcion ? `${idBase}-descripcion-error` : undefined}
                maxLength={500}
              />
              {errores.descripcion && (
                <span id={`${idBase}-descripcion-error`} className="field-error" role="alert">
                  {errores.descripcion}
                </span>
              )}
            </div>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn-secondary" onClick={onCancelar} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
