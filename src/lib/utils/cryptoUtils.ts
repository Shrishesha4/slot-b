import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

export function generateChallenge(): string {
  return uuidv4();
}

export function hashData(data: string): string {
  return CryptoJS.SHA256(data).toString();
}

export function encryptData(data: any, key: string): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decryptData(ciphertext: string, key: string): any {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}