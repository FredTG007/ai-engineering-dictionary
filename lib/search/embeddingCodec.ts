/** A unit vector stored as int8 components plus the scale that maps them back to floats. */
export interface EncodedEmbedding {
  scale: number;
  /** Base64 of one signed byte per dimension. */
  values: string;
}

const INT8_MAX = 127;

/** Quantises each component to int8, scaled so the largest component maps to ±127. */
export function encodeEmbedding(vector: ArrayLike<number>): EncodedEmbedding {
  const largest = Math.max(0, ...Array.from(vector, Math.abs));
  const scale = largest / INT8_MAX;
  const bytes = Int8Array.from(vector, (value) => (scale === 0 ? 0 : Math.round(value / scale)));
  return { scale, values: bytesToBase64(new Uint8Array(bytes.buffer)) };
}

export function decodeEmbedding({ scale, values }: EncodedEmbedding): Float32Array {
  const bytes = new Int8Array(base64ToBytes(values).buffer);
  return Float32Array.from(bytes, (value) => value * scale);
}

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(base64: string): Uint8Array {
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}
