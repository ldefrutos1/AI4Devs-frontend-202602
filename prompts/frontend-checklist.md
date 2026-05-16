# Checklist — Nueva funcionalidad frontend (React)

Usar como **contexto** al implementar y como **auditoría** antes de dar por cerrada la tarea.

---

## Estructura y archivos

- [ ] El componente vive en `frontend/src/components/`
- [ ] Un componente por archivo, nombre en PascalCase, `export default`
- [ ] Las llamadas al backend viven en `frontend/src/services/` (no `fetch` directo en componentes)
- [ ] La ruta nueva está registrada en `frontend/src/App.js`

## Componentes React

- [ ] Componente funcional (arrow function o `function`)
- [ ] Estado local con `useState` (sin Redux/Context salvo necesidad explícita)
- [ ] Props de callback para comunicar con hijos (`onChange`, `onUpload`, etc.)
- [ ] Composición: piezas reutilizables extraídas a componentes hijos (ej. uploader, listas dinámicas)

## UI y estilos (Bootstrap)

- [ ] Layout con `Container` → `Row` → `Col`
- [ ] Contenido en `Card` con `shadow` / `shadow-sm` y padding (`p-4`)
- [ ] Botones con `variant` semántico (`primary`, `secondary`, `danger`)
- [ ] Espaciado con utilidades Bootstrap (`mt-5`, `mb-4`, `text-center`)
- [ ] Formularios con `Form.Group`, `Form.Label`, `Form.Control` y `shadow-sm` en inputs
- [ ] Iconos con `react-bootstrap-icons` si aplica
- [ ] Fechas con `react-datepicker` y CSS importado si aplica
- [ ] Textos de interfaz en **español**

## Enrutamiento

- [ ] Ruta en kebab-case (ej. `/add-candidate`)
- [ ] Navegación con `<Link to="...">` desde pantallas existentes si corresponde
- [ ] Pantalla accesible y coherente con el flujo del dashboard

## Datos y API

- [ ] URL base centralizada en `services/` (`http://localhost:3010` o `REACT_APP_API_URL` si se introduce)
- [ ] Implementación con **`fetch` nativo** dentro de `services/` (sin axios ni llamadas API en componentes)
- [ ] Manejo explícito de códigos HTTP (`201`, `400`, `500`, etc.)
- [ ] Transformación de datos antes del envío si el backend lo exige (ej. fechas → `YYYY-MM-DD`)
- [ ] Subida de archivos: primero `POST /upload`, luego enviar `{ filePath, fileType }` en el payload

## Formularios y UX

- [ ] Validación HTML donde aplique (`required`, `type="email"`, etc.)
- [ ] Feedback al usuario con `<Alert variant="danger">` y/o `<Alert variant="success">`
- [ ] Estados de carga visibles si hay operaciones async (ej. `Spinner` en subidas)
- [ ] Secciones dinámicas con handlers reutilizables (`handleAddSection`, `handleRemoveSection`) si aplica

## TypeScript (si aplica)

- [ ] Archivo `.tsx` para pantallas con modelo de datos tipado
- [ ] Tipos definidos en el mismo archivo o importados de forma clara
- [ ] `React.FC` o tipado explícito de props según el patrón de `Positions.tsx`

## Calidad y coherencia

- [ ] No se modifica `App.tsx` (plantilla CRA); la app activa es `App.js`
- [ ] Bootstrap importado globalmente en `App.js` (no duplicar import innecesario)
- [ ] Sin dependencias nuevas salvo que la tarea lo requiera
- [ ] La funcionalidad se probó manualmente contra el backend en `localhost:3010`

---

## Auditoría rápida (antes de cerrar)

| Pregunta | Sí / No |
|----------|---------|
| ¿Sigue el layout Card + grid del resto de pantallas? | |
| ¿Las rutas y links encajan con el dashboard? | |
| ¿Errores y éxito se muestran al usuario? | |
| ¿El payload coincide con lo que espera el API? | |
| ¿Todas las llamadas al backend pasan por `services/` con `fetch`? | |
