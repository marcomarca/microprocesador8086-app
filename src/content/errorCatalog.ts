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
  cree_copia_ax_completo: 'Cree que MOV DL, AL copia AX completo.',
  confunde_little_endian: 'Confunde el orden de bytes en memoria.',
  no_comprende_dw_16_bits: 'No identifica que DW reserva una palabra de 16 bits.',
  confunde_etiqueta_con_direccion: 'Cree que la etiqueta representa solo la dirección, no el contenido asociado.',
  confunde_bytes_con_valor_logico: 'Interpreta los bytes físicos como si fueran el valor lógico cargado.',
  add_reemplaza_destino: 'Cree que ADD reemplaza el destino con la fuente.',
  add_no_modifica_destino: 'Cree que ADD no modifica AX.',
  confunde_inmediato_con_memoria: 'Confunde un literal inmediato con una etiqueta de memoria.',
  confunde_inmediato_con_registro: 'Confunde un literal inmediato con un registro.',
  sub_no_modifica_destino: 'Cree que SUB no modifica AX.',
  sub_reemplaza_destino: 'Cree que SUB reemplaza AX con el inmediato.',
  mov_borra_fuente: 'Cree que MOV borra el registro fuente.',
  no_reconoce_escritura_memoria: 'No reconoce que MOV word R, AX escribe en memoria.',
  pierde_byte_alto: 'No conserva el byte alto al representar una palabra.'
};
