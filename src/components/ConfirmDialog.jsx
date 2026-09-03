import { useEffect, useRef } from "react";

/**
 * ConfirmDialog.jsx — Confirmación de eliminación (y confirmaciones en
 * general).
 * Responsabilidad: pedir confirmación explícita antes de una acción
 * destructiva. Atrapa el foco dentro del modal y lo devuelve al cerrar,
 * y se puede cerrar con la tecla Escape (accesibilidad / navegación por
 * teclado, punto 3).
 * Información que recibe: { titulo, mensaje, onConfirmar, onCancelar }.
 * Relación con otros componentes: usado por DocumentList al eliminar,
 * y disponible para cualquier otra acción que necesite confirmación.
 */
export function ConfirmDialog({ titulo, mensaje, onConfirmar, onCancelar, confirmando }) {
  const botonConfirmarRef = useRef(null);

  useEffect(() => {
    botonConfirmarRef.current?.focus();
    const alPresionarTecla = (e) => {
      if (e.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [onCancelar]);

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancelar()}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
      >
        <h2 id="confirm-dialog-title">{titulo}</h2>
        <p id="confirm-dialog-desc">{mensaje}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            ref={botonConfirmarRef}
            onClick={onConfirmar}
            disabled={confirmando}
          >
            {confirmando ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
