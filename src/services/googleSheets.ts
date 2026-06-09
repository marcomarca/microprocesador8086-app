import { appConfig } from '../content/appConfig';
import type { GoogleSheetsPayload } from '../types';

export type SubmitResult = {
  ok: boolean;
  message: string;
};

export async function submitResultToGoogleSheets(payload: GoogleSheetsPayload): Promise<SubmitResult> {
  if (!appConfig.googleSheets.enabled || !appConfig.googleSheets.webAppUrl) {
    return {
      ok: false,
      message: 'El envío a Google Sheets todavía no está configurado.'
    };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), appConfig.googleSheets.timeoutMs);

  try {
    const response = await fetch(appConfig.googleSheets.webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    // En mode no-cors la respuesta es opaque. Si no lanza excepción, se considera enviado.
    void response;
    return { ok: true, message: 'Resultado enviado.' };
  } catch {
    return {
      ok: false,
      message: 'No se pudo enviar el resultado. Conserva el TXT como respaldo.'
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
