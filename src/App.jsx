import { Sidebar } from "./components/Sidebar";
import { DocumentosPage } from "./pages/DocumentosPage";
import "./index.css";

/**
 * App.jsx — Componente raíz.
 * Responsabilidad: definir el layout general (barra lateral + contenido)
 * y el enlace de salto de accesibilidad. No maneja datos de negocio.
 */
export default function App() {
  return (
    <div className="app-shell">
      <a href="#documentos" className="skip-link">
        Saltar al contenido principal
      </a>
      <Sidebar />
      <main className="main">
        <DocumentosPage />
      </main>
    </div>
  );
}
