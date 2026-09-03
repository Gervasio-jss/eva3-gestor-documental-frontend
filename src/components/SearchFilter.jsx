import { TIPOS_DOCUMENTO } from "../services/documentosApi";

/**
 * SearchFilter.jsx — Búsqueda y filtros del listado.
 * Responsabilidad: capturar el texto de búsqueda y el tipo de documento
 * seleccionado; es un componente controlado, no mantiene datos propios.
 * Información que recibe: { busqueda, tipo, onBusquedaChange, onTipoChange }.
 * Relación con otros componentes: usado por DocumentosPage; su salida
 * alimenta a useDocumentos a través del componente padre.
 */
export function SearchFilter({ busqueda, tipo, onBusquedaChange, onTipoChange }) {
  return (
    <form className="filters" role="search" aria-label="Buscar y filtrar documentos">
      <div className="field">
        <label htmlFor="busqueda">Buscar</label>
        <input
          id="busqueda"
          type="search"
          placeholder="Título o descripción…"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="tipo-filtro">Tipo de documento</label>
        <select id="tipo-filtro" value={tipo} onChange={(e) => onTipoChange(e.target.value)}>
          <option value="">Todos los tipos</option>
          {TIPOS_DOCUMENTO.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
