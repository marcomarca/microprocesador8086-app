# Guía estricta para Codex / IA implementadora

Esta guía define cómo ampliar el proyecto sin romper la arquitectura.

## 1. Principio central

El proyecto es una SPA educativa. No se deben crear páginas nuevas ni rutas por URL.

La navegación se controla con estado interno:

```text
menu → exercise → final → review / variant → menu
```

No usar router.
No usar backend propio.
No duplicar lógica de pantallas.

## 2. Tecnologías permitidas

Permitido:

```text
Svelte
TypeScript
Vite
Zod
CSS plano
localStorage
Google Apps Script como receptor externo opcional
```

No agregar sin justificación:

```text
React
Redux
Router
SvelteKit
Tailwind
Bootstrap
Material UI
Chart.js
jQuery
Base de datos propia
Servidor Node
```

## 3. Dónde agregar ejercicios

Cada nuevo ejercicio debe vivir en `src/content/`.

Convención de nombre:

```text
src/content/<topic><Level>.ts
```

Ejemplos:

```text
src/content/movPartialRegisters.ts
src/content/addBasic.ts
src/content/flagsCarry.ts
```

Cada archivo debe exportar un `Exercise`:

```ts
import type { Exercise } from '../types';

export const addBasicExercise: Exercise = {
  id: 'add_basic_01',
  moduleId: 'mod_add',
  order: 1,
  title: 'Ejercicio 1 · ADD',
  subtitle: 'Suma básica en registros',
  description: 'Predice el resultado de sumas simples en registros 8086.',
  estimatedMinutes: 8,
  initialRegisters: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
  passing: {
    canAdvance: 5,
    reviewRecommended: 3.5,
    mustRepeat: 2
  },
  codeLines: [],
  steps: []
};
```

Luego debe registrarse en `src/content/index.ts`:

1. Importar el ejercicio.
2. Agregarlo al array `exercises`.
3. Agregar su ID al módulo correspondiente.
4. Si el módulo no existe, crear un nuevo objeto en `modules`.

## 4. Reglas de IDs

Usar IDs estables y sin acentos.

Formato de módulos:

```text
mod_mov
mod_add
mod_flags
mod_memory
```

Formato de ejercicios:

```text
mov_basic_01
mov_partial_01
add_basic_01
flags_carry_01
```

Formato de pasos:

```text
E1_Q1
E1_Q2
ADD1_Q1
FLAGS1_Q1
```

No cambiar IDs existentes si ya hay usuarios usando la app. Cambiar un ID rompe progreso guardado en `localStorage`.

## 5. Estructura obligatoria de cada step

Cada paso de opción múltiple debe tener:

```ts
{
  id: 'E1_Q1',
  step: 1,
  codeIndex: 0,
  title: 'Instrucción actual',
  instruction: 'MOV AX, 0x1234',
  question: '¿Qué valor tendrá AX?',
  before: { AX: '0000', BX: '0000', CX: '0000', DX: '0000' },
  after: { AX: '1234', BX: '0000', CX: '0000', DX: '0000' },
  changed: ['AX'],
  correctExplain: 'AX queda 1234 porque 0x1234 es un dato inmediato.',
  options: []
}
```

Reglas:

- `before` debe representar el estado antes de responder.
- `after` debe representar el estado correcto después de resolver.
- `changed` solo debe incluir registros visualmente modificados.
- `codeIndex` debe apuntar a una línea válida de `codeLines`.
- Cada step debe tener exactamente una opción correcta.
- Cada opción incorrecta debe tener `hint`.
- Cada opción incorrecta debe tener `tag` si representa un error conceptual diagnosticable.

## 6. Reglas de opciones

Cada opción debe seguir este patrón:

```ts
{
  id: 'A',
  text: 'AX = 1234',
  correct: true,
  feedback: 'MOV copia el dato inmediato 1234h hacia AX.'
}
```

Opción incorrecta:

```ts
{
  id: 'B',
  text: 'AX = 0000',
  correct: false,
  tag: 'no_reconoce_inmediato',
  hint: '0x1234 es un dato inmediato. La instrucción carga ese valor directamente en AX.'
}
```

No usar feedback genérico como "incorrecto". La pista debe corregir el error conceptual.

## 7. Etiquetas de error conceptual

Las etiquetas viven en `src/content/errorCatalog.ts`.

Si se agrega una etiqueta nueva, también se debe agregar su descripción.

Ejemplo:

```ts
confunde_carry_overflow: 'Confunde la bandera Carry con la bandera Overflow.'
```

Reglas:

- Usar snake_case.
- No usar acentos.
- No crear etiquetas duplicadas para el mismo concepto.
- Preferir etiquetas conceptuales, no etiquetas superficiales.

Mal:

```text
se_equivoco_en_pregunta_3
respuesta_mala
```

Bien:

```text
confunde_ah_al
cree_mov_borra_fuente
confunde_carry_overflow
```

## 8. Criterios de puntaje

El motor actual usa:

```text
Correcto al primer intento: 1 punto
Correcto después de pista: 0.5 puntos
No corregido: 0 puntos
```

No modificar esta regla dentro de un ejercicio.

Si se necesita otro tipo de puntaje, modificar el motor en `src/engine/session.ts` y actualizar esta guía.

## 9. Criterios de aprobación por ejercicio

Cada ejercicio define:

```ts
passing: {
  canAdvance: 5,
  reviewRecommended: 3.5,
  mustRepeat: 2
}
```

Para ejercicios con distinto número de preguntas, ajustar los umbrales.

Ejemplo para 4 preguntas:

```ts
passing: {
  canAdvance: 3.5,
  reviewRecommended: 2.5,
  mustRepeat: 1.5
}
```

## 10. Review y variante

Un ejercicio puede tener `review` y `variant`.

Usar `review` para repasar errores frecuentes.
Usar `variant` para transferencia del aprendizaje.

No convertir el review en otro ejercicio largo. Debe ser corto.

## 11. Desbloqueo de ejercicios

No tocar el sistema de desbloqueo salvo necesidad explícita.

Regla actual:

- El primer ejercicio está disponible.
- Completar la ruta en orden desbloquea el siguiente.
- Desbloquear manualmente un ejercicio solo desbloquea ese ejercicio.
- Completar un ejercicio saltado no desbloquea los posteriores si no se completó la ruta previa.

La lógica está en:

```text
src/engine/session.ts
```

Funciones relevantes:

```ts
flattenExerciseOrder
getExerciseAccess
manuallyUnlockExercise
applyExerciseCompletion
```

## 12. Exportación TXT

El reporte legible se genera en:

```text
src/engine/report.ts
```

No reemplazarlo por JSON como salida principal para estudiantes.
JSON puede agregarse después solo como herramienta técnica.

## 13. Google Sheets

El envío está en:

```text
src/services/googleSheets.ts
```

No hardcodear datos sensibles.
No enviar automáticamente sin acción del usuario.
No bloquear la experiencia si falla el envío.
Si el envío falla, el usuario debe poder conservar el TXT.

## 14. Validación antes de terminar una tarea

Antes de entregar cambios, ejecutar:

```bash
npm run validate:content
npm run check
npm run build:github
```

Si se modificó el build HTML único:

```bash
npm run build:single
```

## 15. Checklist obligatorio para cada nuevo ejercicio

- [ ] El archivo del ejercicio está en `src/content/`.
- [ ] El ejercicio exporta un objeto `Exercise` tipado.
- [ ] El ID no tiene acentos, espacios ni mayúsculas innecesarias.
- [ ] El módulo existe o fue creado.
- [ ] El ejercicio fue registrado en `courseContent.exercises`.
- [ ] El ID fue agregado al módulo correcto.
- [ ] Cada step tiene exactamente una respuesta correcta.
- [ ] Cada opción incorrecta tiene pista.
- [ ] Las etiquetas nuevas están en `errorCatalog`.
- [ ] `before`, `after` y `changed` son coherentes.
- [ ] `codeIndex` apunta a una línea válida.
- [ ] El ejercicio tiene umbrales `passing` adecuados.
- [ ] El contenido visible está en español.
- [ ] El código interno mantiene nombres en inglés.
- [ ] `npm run validate:content` pasa sin errores.

## 16. Prompt recomendado para Codex

Usar este patrón:

```text
Agrega un nuevo ejercicio al proyecto siguiendo AI_IMPLEMENTATION_GUIDE.md.
Tema: <tema>
Módulo: <módulo>
Objetivo conceptual: <objetivo>
Código base del ejercicio: <líneas de ensamblador>
Errores conceptuales esperados: <lista>
Mantén la estructura de Exercise.
No modifiques el motor salvo que sea estrictamente necesario.
Ejecuta validate:content y corrige errores.
```

## 17. Criterio de aceptación final

Una tarea está terminada solo si:

1. El ejercicio aparece en el menú.
2. Se puede resolver de inicio a fin.
3. El puntaje se calcula correctamente.
4. El diagnóstico muestra etiquetas útiles.
5. El progreso se conserva al recargar.
6. La exportación TXT funciona.
7. El build para GitHub Pages funciona.
