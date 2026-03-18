//! Cryptographic utilities for sensitive data encryption
//!
//! Provides AES256-GCM encryption with device-specific key derivation
//! for securing sensitive configuration values like license keys.

use aes_gcm::aead::{Aead, AeadCore, KeyInit, OsRng};
use aes_gcm::{Aes256Gcm, Nonce};
use base64::{Engine, engine::general_purpose::STANDARD as BASE64};
use machine_id::MachineId;
use sha2::{Digest, Sha256};
use thiserror::Error;

const ENCRYPTION_PREFIX: &str = "enc:";
const NONCE_SIZE: usize = 12;
const KEY_SIZE: usize = 32;

/// Errors that can occur during cryptographic operations
#[derive(Debug, Error)]
pub enum CryptoError {
    #[error("Encryption failed: {0}")]
    EncryptionFailed(String),

    #[error("Decryption failed: {0}")]
    DecryptionFailed(String),

    #[error("Invalid encrypted value format: {0}")]
    InvalidFormat(String),

    #[error("Value is not encrypted (missing 'enc:' prefix)")]
    NotEncrypted,

    #[error("Base64 decoding failed: {0}")]
    Base64Error(String),
}

/// Derives a device-specific encryption key from the machine ID
///
/// # Returns
/// A 256-bit key derived from the machine identifier using HKDF-SHA256
///
/// # Note
/// This key is deterministic for the same device, ensuring that
/// encrypted values can be decrypted on the same machine
fn derive_device_key() -> Result<[u8; KEY_SIZE], CryptoError> {
    let machine_id = MachineId::get();
    let machine_id_str = machine_id.to_string();

    let mut hasher = Sha256::new();
    hasher.update(machine_id_str.as_bytes());
    hasher.update(b"tauri-start-solid-encryption-key");
    let result = hasher.finalize();

    let mut key = [0u8; KEY_SIZE];
    key.copy_from_slice(&result[..KEY_SIZE]);
    Ok(key)
}

/// Encrypts a sensitive value using AES256-GCM with device-specific key
///
/// # Arguments
/// * `value` - The plaintext value to encrypt
///
/// # Returns
/// A string prefixed with "enc:" followed by Base64-encoded ciphertext
///
/// # Example
/// ```
/// let encrypted = encrypt_sensitive("MY-LICENSE-KEY")?;
/// // Returns: "enc:YWVzLTI1Ni1nY206..." (Base64-encoded nonce + ciphertext)
/// ```
pub fn encrypt_sensitive(value: &str) -> Result<String, CryptoError> {
    let key = derive_device_key()?;
    let cipher = Aes256Gcm::new_from_slice(&key)
        .map_err(|e| CryptoError::EncryptionFailed(format!("Failed to create cipher: {}", e)))?;

    let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
    let ciphertext = cipher
        .encrypt(&nonce, value.as_bytes())
        .map_err(|e| CryptoError::EncryptionFailed(format!("Failed to encrypt: {}", e)))?;

    let mut encrypted_bytes = nonce.to_vec();
    encrypted_bytes.extend_from_slice(&ciphertext);

    let encoded = BASE64.encode(encrypted_bytes);
    Ok(format!("{}{}", ENCRYPTION_PREFIX, encoded))
}

/// Decrypts an encrypted value that was encrypted with `encrypt_sensitive`
///
/// # Arguments
/// * `enc_value` - The encrypted value with "enc:" prefix
///
/// # Returns
/// The decrypted plaintext value
///
/// # Example
/// ```
/// let decrypted = decrypt_sensitive("enc:YWVzLTI1Ni1nY206...")?;
/// // Returns: "MY-LICENSE-KEY"
/// ```
pub fn decrypt_sensitive(enc_value: &str) -> Result<String, CryptoError> {
    if !enc_value.starts_with(ENCRYPTION_PREFIX) {
        return Err(CryptoError::NotEncrypted);
    }

    let encoded = &enc_value[ENCRYPTION_PREFIX.len()..];
    let encrypted_bytes = BASE64
        .decode(encoded)
        .map_err(|e| CryptoError::Base64Error(format!("Failed to decode Base64: {}", e)))?;

    if encrypted_bytes.len() < NONCE_SIZE {
        return Err(CryptoError::InvalidFormat("Encrypted value too short".to_string()));
    }

    let key = derive_device_key()?;
    let cipher = Aes256Gcm::new_from_slice(&key)
        .map_err(|e| CryptoError::DecryptionFailed(format!("Failed to create cipher: {}", e)))?;

    let mut nonce_bytes = [0u8; NONCE_SIZE];
    nonce_bytes.copy_from_slice(&encrypted_bytes[..NONCE_SIZE]);
    let nonce = Nonce::from(nonce_bytes);
    let ciphertext = &encrypted_bytes[NONCE_SIZE..];

    let plaintext = cipher
        .decrypt(&nonce, ciphertext)
        .map_err(|e| CryptoError::DecryptionFailed(format!("Failed to decrypt: {}", e)))?;

    String::from_utf8(plaintext)
        .map_err(|e| CryptoError::DecryptionFailed(format!("Invalid UTF-8 in decrypted data: {}", e)))
}

/// Checks if a value is encrypted (starts with "enc:" prefix)
///
/// # Arguments
/// * `value` - The value to check
///
/// # Returns
/// true if the value has the "enc:" prefix, false otherwise
#[inline]
pub fn is_encrypted(value: &str) -> bool {
    value.starts_with(ENCRYPTION_PREFIX)
}

/// Conditionally decrypts a value if it's encrypted, otherwise returns as-is
///
/// # Arguments
/// * `value` - The value to potentially decrypt
///
/// # Returns
/// The decrypted value if encrypted, otherwise the original value
///
/// # Note
/// This is useful for backward compatibility - values that are already
/// encrypted will be decrypted, while plain values are returned unchanged
pub fn maybe_decrypt(value: &str) -> Result<String, CryptoError> {
    if is_encrypted(value) {
        decrypt_sensitive(value)
    } else {
        Ok(value.to_string())
    }
}

/// Conditionally encrypts a value if it's not already encrypted
///
/// # Arguments
/// * `value` - The value to potentially encrypt
///
/// # Returns
/// The encrypted value with "enc:" prefix if not already encrypted,
/// otherwise returns the original value
///
/// # Note
/// This is useful for ensuring sensitive values are always encrypted
/// before storage, while avoiding double-encryption
pub fn maybe_encrypt(value: &str) -> Result<String, CryptoError> {
    if is_encrypted(value) {
        Ok(value.to_string())
    } else {
        encrypt_sensitive(value)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt_roundtrip() {
        let plaintext = "MY-LICENSE-KEY-12345";
        let encrypted = encrypt_sensitive(plaintext).unwrap();
        assert!(encrypted.starts_with(ENCRYPTION_PREFIX));

        let decrypted = decrypt_sensitive(&encrypted).unwrap();
        assert_eq!(decrypted, plaintext);
    }

    #[test]
    fn test_is_encrypted() {
        assert!(is_encrypted("enc:SGVsbG8="));
        assert!(!is_encrypted("plain-text"));
    }

    #[test]
    fn test_maybe_decrypt() {
        let encrypted = encrypt_sensitive("sensitive").unwrap();
        assert_eq!(maybe_decrypt(&encrypted).unwrap(), "sensitive");
        assert_eq!(maybe_decrypt("not-encrypted").unwrap(), "not-encrypted");
    }

    #[test]
    fn test_maybe_encrypt() {
        let encrypted = encrypt_sensitive("sensitive").unwrap();
        assert_eq!(maybe_encrypt(&encrypted).unwrap(), encrypted);
        assert!(maybe_encrypt("plain").unwrap().starts_with(ENCRYPTION_PREFIX));
    }
}
