import type { ConceptErrorTag } from '../types';

export const errorCatalog: Record<ConceptErrorTag, string> = {
  no_reconoce_inmediato: 'No interpreta correctamente un dato inmediato.',
  confunde_endianness_registro: 'Invierte bytes dentro del registro sin corresponder.',
  invierte_fuente_destino: 'Confunde el orden destino, fuente.',
  cree_mov_borra_fuente: 'Cree que MOV elimina el valor de la fuente.',
  confunde_cl_ch: 'Confunde byte bajo CL con byte alto CH.',
  cree_byte_no_afecta_registro: 'No entiende que CL forma parte de CX.',
  cree_ah_borra_al: 'Cree que modificar AH borra AL.',
  confunde_ah_al: 'Confunde byte alto AH con byte bajo AL.',
  cree_copia_ax_completo: 'Cree que MOV DL, AL copia AX completo.'
};
