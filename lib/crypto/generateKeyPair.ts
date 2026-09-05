export async function generateIdentityKeys() {
  return await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true, // قابل للتصدير
    ["deriveKey", "deriveBits"],
  );
}

export async function exportKeyJWK(key: CryptoKey) {
  return await window.crypto.subtle.exportKey("jwk", key);
}
