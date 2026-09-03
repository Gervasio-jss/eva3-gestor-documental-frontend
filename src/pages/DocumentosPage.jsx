import { useState } from "react";
import { useDocumentos } from "../hooks/useDocumentos";
import { useDebounce } from "../hooks/useDebounce";
import { documentosApi, ApiError } from "../services/documentosApi";
import { SearchFilter } from "../components/SearchFilter";
import { DocumentList } from "../components/DocumentList";
import { DocumentDetail } from "../components/DocumentDetail";
import { DocumentForm } from "../components/DocumentForm";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { StatusMessage } from "../components/StatusMessage";

/**
 * DocumentosPage.jsx — Página/contenedor principal.
 * Responsabilidad: coordinar el estado de la pantalla (búsqueda, filtro,
 * modal abierto) y conectar los componentes de presentación con el hook
 * de datos y el servicio de API. Es el único lugar que decide "qué modal
 * está abierto", para que cada componente hijo se mantenga simple.
 */
export function DocumentosPage() {
  const [busquedaInput, setBusquedaInput] = useState("");
  const [tipo, setTipo] = useState("");
  const busqueda = useDebounce(busquedaInput);

  const { documentos, cargando, error, recargar } = useDocumentos({ busqueda, tipo });

  const [documentoAVer, setDocumentoAVer] = useState(null);
  const [documentoAEditar, setDocumentoAEditar] = useState(null);
  const [creandoNuevo, setCreandoNuevo] = useState(false);
  const [documentoAEliminar, setDocumentoAEliminar] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  async function manejarGuardar(datos) {
    setEnviando(true);
    try {
      if (documentoAEditar) {
        await documentosApi.actualizar(documentoAEditar.id, datos);
        setMensaje({ tipo: "success", texto: "Documento actualizado correctamente." });
      } else {
        await documentosApi.crear(datos);
        setMensaje({ tipo: "success", texto: "Documento creado correctamente." });
      }
      setDocumentoAEditar(null);
      setCreandoNuevo(false);
      await recargar();
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: err instanceof ApiError ? err.message : "No fue posible guardar el documento.",
      });
    } finally {
      setEnviando(false);
    }
  }

  async function manejarEliminar() {
    if (!documentoAEliminar) return;
    setEnviando(true);
    try {
      await documentosApi.eliminar(documentoAEliminar.id);
      setMensaje({ tipo: "success", texto: "Documento eliminado correctamente." });
      setDocumentoAEliminar(null);
      await recargar();
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: err instanceof ApiError ? err.message : "No fue posible eliminar el documento.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="documentos" aria-labelledby="documentos-titulo">
      <div className="page-header">
        <div>
          <h1 id="documentos-titulo">Documentos</h1>
          <p>Memos, oficios, citaciones, acuerdos, actas comunales y permisos administrativos.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setCreandoNuevo(true)}>
          + Nuevo documento
        </button>
      </div>

      <StatusMessage tipo={mensaje?.tipo} mensaje={mensaje?.texto} />
      {error && <StatusMessage tipo="error" mensaje={error} />}

      <SearchFilter
        busqueda={busquedaInput}
        tipo={tipo}
        onBusquedaChange={setBusquedaInput}
        onTipoChange={setTipo}
      />

      <DocumentList
        documentos={documentos}
        cargando={cargando}
        onVer={setDocumentoAVer}
        onEditar={setDocumentoAEditar}
        onEliminar={setDocumentoAEliminar}
      />

      {documentoAVer && (
        <DocumentDetail
          documento={documentoAVer}
          onCerrar={() => setDocumentoAVer(null)}
          onEditar={(doc) => {
            setDocumentoAVer(null);
            setDocumentoAEditar(doc);
          }}
        />
      )}

      {(creandoNuevo || documentoAEditar) && (
        <DocumentForm
          documentoInicial={documentoAEditar}
          guardando={enviando}
          onGuardar={manejarGuardar}
          onCancelar={() => {
            setCreandoNuevo(false);
            setDocumentoAEditar(null);
          }}
        />
      )}

      {documentoAEliminar && (
        <ConfirmDialog
          titulo="Eliminar documento"
          mensaje={`¿Confirma que desea eliminar "${documentoAEliminar.titulo}"? Esta acción no se puede deshacer.`}
          confirmando={enviando}
          onConfirmar={manejarEliminar}
          onCancelar={() => setDocumentoAEliminar(null)}
        />
      )}
    </section>
  );
}
