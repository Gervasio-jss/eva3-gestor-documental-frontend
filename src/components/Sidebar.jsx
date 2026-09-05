/**
 * Sidebar.jsx — Componente de navegación.
 * Responsabilidad: mostrar la marca de la aplicación y el enlace a la
 * sección de documentos. No recibe datos de negocio; solo controla el
 * ítem activo para accesibilidad (aria-current).
 * Relación con otros componentes: envuelve a <DocumentosPage> en App.jsx.
 */
export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="sidebar__brand">
      <h1>Gestor Documental</h1>
        <small>Escuela Básica G-733 · Chorombo Bajo</small>
        </div>
      <nav>
        <ul>
          <li>
            <a href="#documentos" aria-current="page">
              Documentos
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
