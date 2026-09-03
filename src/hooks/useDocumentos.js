import { useCallback, useEffect, useState } from "react";
import { documentosApi, ApiError } from "../services/documentosApi";

/**
 * useDocumentos
 * -----------------------------------------------------------------------
 * Hook central de datos: aísla a los componentes de la lógica de carga,
 * estados de carga/error y refresco de la lista, siguiendo el patrón de
 * "contenedor + componentes de presentación" del framework.
 * -----------------------------------------------------------------------
 */
export function useDocumentos({ busqueda = "", tipo = "" } = {}) {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await documentosApi.listar({ busqueda, tipo });
      setDocumentos(datos);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No fue posible cargar los documentos.");
    } finally {
      setCargando(false);
    }
  }, [busqueda, tipo]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { documentos, cargando, error, recargar };
}
