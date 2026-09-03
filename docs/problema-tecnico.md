# Problema técnico resuelto (Punto 2)

## Problema
Al construir `DocumentList` junto al formulario de creación/edición, cada
tecla escrita en el campo de búsqueda volvía a renderizar toda la tabla y,
peor aún, disparaba una nueva solicitud a la API en cada pulsación —
incluso mientras el usuario todavía estaba escribiendo la palabra que
quería buscar.

## Causa detectada
El valor del input de búsqueda estaba conectado directamente al hook de
datos (`useDocumentos`), por lo que cualquier cambio de estado del input
provocaba de inmediato un nuevo `useEffect` → nueva petición.

## Alternativas consideradas
1. **Buscar solo al enviar el formulario (botón "Buscar").** Simple, pero
   contradice el requisito de una búsqueda fluida e inmediata para el
   equipo directivo.
2. **Debounce del valor de búsqueda antes de pasarlo al hook de datos.**
   Mantiene la sensación de "búsqueda en vivo" sin sobrecargar la red.
3. **Buscar solo en el cliente sobre una lista ya cargada por completo.**
   No es viable a mediano plazo: el Backend pagina y filtra por tamaño de
   la base documental, y duplicar esa lógica en el Frontend rompería el
   contrato de datos.

## Solución implementada
Se optó por la alternativa 2: se creó el hook `useDebounce` (`src/hooks/useDebounce.js`)
que retrasa 350ms la propagación del texto de búsqueda. `DocumentosPage`
mantiene dos estados separados — `busquedaInput` (lo que el usuario ve y
escribe) y `busqueda` (el valor "debounced" que realmente dispara la
petición) — de modo que el campo de texto responde instantáneamente pero
la llamada a la API espera a que el usuario haga una pausa al escribir.

## Resultado obtenido
Una búsqueda de 10 caracteres pasó de generar hasta 10 solicitudes HTTP a
generar 1 sola solicitud, sin que el usuario perciba ningún retraso al
escribir.

## Aprendizaje
Separar "estado de UI" (lo que se ve en pantalla) de "estado de consulta"
(lo que efectivamente se envía a la API) es un patrón reutilizable para
cualquier campo de filtro futuro (por ejemplo, si se agrega un filtro por
rango de fechas). La solución no afecta la mantenibilidad: `useDebounce`
es genérico y no conoce nada del dominio de documentos, por lo que puede
reutilizarse en cualquier otro campo de búsqueda del proyecto.
