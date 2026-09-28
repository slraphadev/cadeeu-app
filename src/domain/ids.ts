/**
 * Gera um UUID v7 (RFC 9562): 48 bits de timestamp em milissegundos,
 * seguidos de bits aleatórios. Ids ordenáveis por tempo de criação,
 * seguros para sincronização entre aparelhos.
 *
 * Função pura: recebe o instante e 10 bytes aleatórios (ou mais).
 */
export function uuidv7(agoraMs: number, aleatorios: Uint8Array): string {
  if (aleatorios.length < 10) throw new Error('uuidv7 precisa de ao menos 10 bytes aleatórios');
  const b = new Uint8Array(16);
  let ts = Math.floor(agoraMs);
  for (let i = 5; i >= 0; i--) {
    b[i] = ts % 256;
    ts = Math.floor(ts / 256);
  }
  b.set(aleatorios.subarray(0, 10), 6);
  b[6] = 0x70 | (b[6] & 0x0f); // versão 7
  b[8] = 0x80 | (b[8] & 0x3f); // variante RFC
  const hex = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
