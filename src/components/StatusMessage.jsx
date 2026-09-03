/**
 * StatusMessage.jsx — Mensajes de estado y confirmación.
 * Responsabilidad: comunicar al usuario el resultado de una acción
 * (éxito, error o información) con la semántica ARIA adecuada para
 * que lectores de pantalla anuncien el cambio automáticamente.
 * Información que recibe: { tipo: "info"|"success"|"error", mensaje }.
 * Relación con otros componentes: usado por DocumentosPage tras crear,
 * editar o eliminar un documento, y por DocumentList ante errores de carga.
 */
export function StatusMessage({ tipo = "info", mensaje }) {
  if (!mensaje) return null;

  const rolPorTipo = tipo === "error" ? "alert" : "status";

  return (
    <div className={`status-banner ${tipo}`} role={rolPorTipo} aria-live="polite">
      <span>{mensaje}</span>
    </div>
  );
}
