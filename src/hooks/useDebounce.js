import { useEffect, useState } from "react";

/**
 * useDebounce
 * -----------------------------------------------------------------------
 * Punto 8 (optimización) — Optimización #1.
 * Situación inicial: el campo de búsqueda disparaba una petición a la API
 * en cada tecla presionada, generando solicitudes innecesarias y
 * renderizados en cascada mientras el usuario aún escribía.
 * Optimización aplicada: se retrasa la propagación del valor de búsqueda
 * 350ms después de la última tecla presionada.
 * Beneficio obtenido: en una búsqueda de 10 caracteres se pasa de ~10
 * solicitudes HTTP a 1, reduciendo carga de red y parpadeo de la lista.
 * -----------------------------------------------------------------------
 */
export function useDebounce(valor, retrasoMs = 350) {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorDebounced(valor), retrasoMs);
    return () => clearTimeout(temporizador);
  }, [valor, retrasoMs]);

  return valorDebounced;
}
