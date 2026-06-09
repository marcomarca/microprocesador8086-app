# Configuración opcional de Google Sheets

El proyecto no necesita backend propio. Para recolectar resultados se puede usar Google Sheets + Google Apps Script.

## 1. Crear hoja

Crea una hoja con columnas sugeridas:

```text
timestamp
participantLabel
courseTitle
courseVersion
exerciseId
exerciseTitle
score
maxScore
status
errorsJson
readableReport
```

## 2. Crear Apps Script

En Google Sheets:

```text
Extensiones → Apps Script
```

Pega este código base:

```js
const SHEET_NAME = 'Resultados';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'timestamp',
        'participantLabel',
        'courseTitle',
        'courseVersion',
        'exerciseId',
        'exerciseTitle',
        'score',
        'maxScore',
        'status',
        'errorsJson',
        'readableReport'
      ]);
    }

    sheet.appendRow([
      new Date().toISOString(),
      payload.participantLabel || 'Sin identificar',
      payload.courseTitle || '',
      payload.courseVersion || '',
      payload.exerciseId || '',
      payload.exerciseTitle || '',
      payload.score ?? '',
      payload.maxScore ?? '',
      payload.status || '',
      JSON.stringify(payload.errors || {}),
      payload.readableReport || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Publicar Web App

```text
Implementar → Nueva implementación → Aplicación web
```

Configura:

```text
Ejecutar como: tú
Quién tiene acceso: cualquier usuario con el enlace
```

Copia la URL que termina en `/exec`.

## 4. Activar en la app

Edita:

```text
src/content/appConfig.ts
```

Cambia:

```ts
googleSheets: {
  enabled: true,
  webAppUrl: 'TU_URL_DE_APPS_SCRIPT',
  timeoutMs: 10000
}
```

## 5. Regla de privacidad

No recolectar datos sensibles. Usar nombre, código de estudiante o alias según el contexto del curso.
