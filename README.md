# Gestor Documental — Escuela Básica G-733 Chorombo Bajo

Frontend del Sistema de Gestión Documental desarrollado para la
Evaluación Sumativa Unidad 3 (curso Frontend). Permite al equipo
directivo de la Escuela Básica G-733 Chorombo Bajo (comuna de María
Pinto) visualizar, buscar, registrar, modificar y eliminar memos,
oficios, citaciones y acuerdos de apoderados, documentos de reuniones
comunales y permisos administrativos.

## 1. Descripción del problema y la solución

**Problema:** la escuela no cuenta con una plataforma para centralizar su
documentación; la gestión se realiza manualmente, lo que dificulta
encontrar, actualizar y dar seguimiento a memos, oficios, citaciones,
acuerdos, actas comunales y permisos.

**Solución:** una aplicación web de una sola página (SPA) que centraliza
el listado y la gestión de todos estos documentos en una interfaz simple,
accesible y consistente, consumiendo los endpoints REST definidos junto
al proyecto de Desarrollo Backend ("Cliente Feliz" / Evaluación Sumativa
U2 sirve de referencia de contrato para esta capa Frontend).

## 2. Tecnologías utilizadas

- **React 19** (framework definido para el proyecto) + Vite como
  bundler/servidor de desarrollo.
- **CSS puro** con variables de diseño (sin librería de componentes de
  terceros), para mantener el control total sobre accesibilidad y
  rendimiento.
- **Fetch API nativa** para el consumo de endpoints.
- Fuentes: Fraunces (títulos) e Inter (texto), vía Google Fonts.

## 3. Estructura del proyecto

```
src/
├─ components/        Componentes de presentación reutilizables
│  ├─ Sidebar.jsx
│  ├─ SearchFilter.jsx
│  ├─ DocumentList.jsx
│  ├─ DocumentDetail.jsx
│  ├─ DocumentForm.jsx
│  ├─ ConfirmDialog.jsx
│  └─ StatusMessage.jsx
├─ pages/
│  └─ DocumentosPage.jsx   Contenedor: conecta datos + componentes
├─ hooks/
│  ├─ useDocumentos.js     Carga, error y recarga del listado
│  └─ useDebounce.js       Optimización de la búsqueda
├─ services/
│  └─ documentosApi.js     Consumo de endpoints + validación + mock
├─ App.jsx
└─ main.jsx
docs/
├─ problema-tecnico.md         Evidencia del punto 2
├─ accesibilidad-usabilidad.md Evidencia de los puntos 3 y 7
└─ retrospectiva.md            Evidencia del punto 13
```

## 4. Componentes (Punto 1)

| Componente | Responsabilidad | Información que recibe | Relación con otros componentes |
|---|---|---|---|
| `Sidebar` | Navegación principal de la aplicación. | Ninguna (estático). | Envuelve a `DocumentosPage` en `App`. |
| `SearchFilter` | Captura texto de búsqueda y tipo de documento. | `busqueda`, `tipo` y sus callbacks de cambio. | Usado por `DocumentosPage`; alimenta a `useDocumentos`. |
| `DocumentList` | Renderiza la tabla de documentos y sus acciones. | Lista de documentos, estado de carga, callbacks de ver/editar/eliminar. | Usado por `DocumentosPage`; abre `DocumentDetail`, `DocumentForm` o `ConfirmDialog`. |
| `DocumentDetail` | Muestra el detalle de un documento (solo lectura). | Un documento y callbacks de cerrar/editar. | Abierto desde `DocumentList`; puede derivar a `DocumentForm`. |
| `DocumentForm` | Formulario de creación/edición con validación. | Documento inicial (opcional) y callbacks de guardar/cancelar. | Usado por `DocumentosPage` para crear y editar. |
| `ConfirmDialog` | Confirmación antes de eliminar. | Título, mensaje y callbacks de confirmar/cancelar. | Usado por `DocumentosPage` antes de llamar a `documentosApi.eliminar`. |
| `StatusMessage` | Mensajes de éxito, error o información. | Tipo y texto del mensaje. | Usado por `DocumentosPage` tras cada acción. |

## 5. Instalación y ejecución

```bash
npm install
cp .env.example .env   # ajustar valores si es necesario
npm run dev            # entorno de desarrollo
npm run build           # build de producción (carpeta dist/)
npm run preview         # sirve el build de producción localmente
```

### Variables de configuración

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_BASE_URL` | URL base del Backend. | `/api` |
| `VITE_USE_MOCK` | `true` usa datos simulados en `localStorage` (sin depender del Backend); `false` consume el Backend real. | `true` |

No se registran credenciales ni claves en el código fuente; toda
configuración de entorno se define en `.env` (no versionado) a partir de
`.env.example`.

## 6. Endpoints consumidos (Punto 10)

| Método | URL | Propósito | Parámetros / cuerpo | Envía | Recibe |
|---|---|---|---|---|---|
| GET | `/api/documentos` | Listar documentos, con búsqueda y filtro opcionales. | Query: `busqueda`, `tipo` | — | Arreglo de documentos |
| GET | `/api/documentos/{id}` | Obtener el detalle de un documento. | `id` en la URL | — | Documento |
| POST | `/api/documentos` | Crear un documento nuevo. | — | `{ titulo, tipo, fecha, descripcion }` | Documento creado |
| PUT | `/api/documentos/{id}` | Actualizar un documento existente. | `id` en la URL | `{ titulo, tipo, fecha, descripcion }` | Documento actualizado |
| DELETE | `/api/documentos/{id}` | Eliminar un documento. | `id` en la URL | — | Sin contenido (204) |
| GET | `/api/tipos-documento` | Obtener el catálogo de tipos de documento. | — | — | Arreglo de tipos |

Durante el desarrollo, `VITE_USE_MOCK=true` simula estas respuestas
respetando el mismo contrato, para no bloquear el avance del Frontend
mientras el Backend termina su despliegue.

## 7. Buenas prácticas aplicadas al proyecto (Punto 5)

1. **Separación de responsabilidades (contenedor vs. presentación).**
   `DocumentosPage` concentra el estado y las llamadas a la API;
   `DocumentList`, `DocumentForm`, etc. solo reciben props y disparan
   callbacks. Ejemplo: `src/pages/DocumentosPage.jsx` vs. `src/components/`.
2. **Nomenclatura consistente en español para el dominio.** Variables,
   props y mensajes usan el vocabulario del negocio (`documento`, `tipo`,
   `busqueda`) en vez de términos técnicos genéricos, para que el código
   sea legible por cualquier integrante del equipo. Ejemplo: todo
   `src/services/documentosApi.js`.
3. **Validación centralizada y reutilizada.** La función `validarDocumento`
   se define una sola vez en `documentosApi.js` y la usan tanto el
   formulario (feedback inmediato) como la propia API antes de
   crear/actualizar, evitando reglas de validación duplicadas y
   desincronizadas.
4. **Manejo de errores sin exponer detalles técnicos.** `ApiError`
   encapsula un mensaje apto para el usuario final; los `catch` de
   `DocumentosPage` nunca muestran el error crudo del navegador o del
   servidor.
5. **Componentes reutilizables y sin estado de red propio.** Ningún
   componente de `src/components/` llama directamente a `fetch`; todos
   reciben datos y funciones por props, lo que permite reutilizarlos o
   probarlos de forma aislada.
6. **Accesibilidad como requisito, no como añadido.** Etiquetas, roles
   ARIA y manejo de foco se definieron junto con cada componente (ver
   `docs/accesibilidad-usabilidad.md`), no como una revisión posterior.
7. **Variables de entorno para configuración sensible.** La URL del
   Backend y el modo mock se leen desde `.env`/`import.meta.env`, nunca
   hardcodeadas en el código fuente.
8. **Optimización basada en evidencia, no especulativa.** Cada
   optimización (ver sección 8) documenta la situación inicial medida
   antes de aplicar el cambio.

## 8. Optimizaciones implementadas (Punto 8)

1. **Debounce en la búsqueda** (`src/hooks/useDebounce.js`): evita
   disparar una solicitud HTTP por cada tecla presionada. Detalle
   completo en `docs/problema-tecnico.md`.
2. **Memoización de filas de la tabla** (`FilaDocumento` en
   `DocumentList.jsx` envuelto en `React.memo`): evita que las filas que
   no cambiaron se vuelvan a renderizar cuando se abre un modal o cambia
   el mensaje de estado.

## 9. Seguridad (Punto 11)

| Medida implementada | Riesgo que busca reducir |
|---|---|
| Validación de datos en el cliente antes de enviarlos (`validarDocumento`). | Envío de datos incompletos o malformados que el Backend tendría que rechazar. |
| Mensajes de error genéricos hacia el usuario (`ApiError`), sin volcar el error técnico original. | Exposición de detalles de infraestructura o de la implementación del Backend. |
| Límite de longitud en título (150) y descripción (500) reflejado también con `maxLength` en el formulario. | Envío de payloads excesivos y desbordes de la interfaz. |
| Uso de `import.meta.env` para URL base y configuración, nunca claves hardcodeadas en el repositorio. | Filtración de credenciales o URLs internas en el control de versiones. |
| Manejo explícito de fallas de `localStorage`/red (bloques `try/catch`) sin romper la aplicación. | Que un error de almacenamiento o de red deje a la aplicación en un estado inconsistente o muestre una pantalla en blanco. |

## 10. Accesibilidad y usabilidad (Punto 3 y 7)

Ver `docs/accesibilidad-usabilidad.md` para la tabla de criterios WCAG
2.1 aplicados y el registro de las pruebas realizadas con un integrante
externo al desarrollo.

## 11. Dificultades y soluciones implementadas (Punto 2)

Ver `docs/problema-tecnico.md`.

## 12. Retrospectiva y mejora continua (Punto 13)

Ver `docs/retrospectiva.md`.

## 13. Control de versiones (Punto 6)

El desarrollo se realizó utilizando ramas individuales para mantener
separados los aportes de cada integrante. Los cambios se registraron
mediante commits descriptivos y posteriormente se integraron mediante
Pull Requests.

Repositorio del proyecto:
https://github.com/Gervasio-jss/eva3-gestor-documental-frontend

Rama de trabajo de Marina:
`feature/Marina`

## 14. Despliegue

- **Desarrollo/demo:** `npm run build` genera la carpeta `dist/`, que
  puede servirse como sitio estático (Netlify, Vercel, GitHub Pages, o
  el mismo servidor del Backend).
- **Integración con el Backend real:** una vez desplegado el Backend,
  actualizar `.env` con `VITE_API_BASE_URL` apuntando a esa URL y
  `VITE_USE_MOCK=false`. No se requiere ningún cambio de código.
