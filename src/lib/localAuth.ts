const PBKDF2_ITERATIONS = 210_000;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export async function hashPassword(
  password: string,
  salt: string,
  iterations = PBKDF2_ITERATIONS
): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure password hashing is unavailable. Use localhost or HTTPS.');
  }

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: Uint8Array.from(salt.match(/.{2}/g) || [], (byte) => parseInt(byte, 16)),
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return bytesToBase64(new Uint8Array(bits));
}

export function createPasswordSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return bytesToHex(salt);
}

export { PBKDF2_ITERATIONS };
