# microprocesador8086-app

Aplicación SPA educativa para ejercicios interactivos de microprocesador 8086.

## Objetivo

- Una sola experiencia de usuario, sin rutas por URL.
- Desarrollo estructurado con Svelte + TypeScript + Vite.
- Salida normal para GitHub Pages: `dist/`.
- Salida opcional en HTML único: `dist-single/index.html`.
- Persistencia local mediante `localStorage`.
- Exportación de resultado en TXT legible.
- Conector preparado para Google Sheets mediante Google Apps Script.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Validar contenido

```bash
npm run validate:content
```

## Build para GitHub Pages

```bash
npm run build:github
```

Salida:

```text
dist/
```

## Build HTML único

```bash
npm run build:single
```

Salida:

```text
dist-single/index.html
```

## Estructura

```text
src/
  App.svelte
  main.ts
  styles.css
  components/
  screens/
  content/
    index.ts
    movBasic.ts
    errorCatalog.ts
    appConfig.ts
    schema.ts
  engine/
    session.ts
    storage.ts
    report.ts
  services/
    googleSheets.ts
scripts/
  validate-content.ts
.github/workflows/
  deploy.yml
```

## Cómo agregar ejercicios

Lee `AI_IMPLEMENTATION_GUIDE.md` antes de modificar contenido.

Regla principal:

```text
No dupliques pantallas.
Agrega ejercicios como datos.
Mantén el motor genérico.
```

## Google Sheets

El envío está preparado pero desactivado.

Para activarlo:

1. Crea un Web App en Google Apps Script.
2. Copia la URL pública del Web App.
3. Edita `src/content/appConfig.ts`:

```ts
googleSheets: {
  enabled: true,
  webAppUrl: 'https://script.google.com/macros/s/.../exec',
  timeoutMs: 10000
}
```

El botón de envío solo aparece si `enabled` es `true`.

## Desbloqueo flexible

- El primer ejercicio está disponible desde el inicio.
- La ruta secuencial desbloquea el siguiente ejercicio cuando se completa el actual.
- Un ejercicio bloqueado puede abrirse manualmente con advertencia.
- El desbloqueo manual solo habilita ese ejercicio, no toda la cadena posterior.

## Persistencia

El progreso se guarda en `localStorage` usando la clave definida en `src/content/appConfig.ts`.
