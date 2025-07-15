import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import * as crypto from 'crypto';

const CRYPTO_KEY = process.env.CRYPTO_KEY || '';

export async function encryptedString(str: string) {
  const iv = randomBytes(16);
  const salt = randomBytes(16).toString('hex');

  const key = (await promisify(scrypt)(CRYPTO_KEY, salt, 32)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  const encryptedText = Buffer.concat([cipher.update(str), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    salt,
    hash: encryptedText.toString('hex'),
  };
}

export async function decryptedString(str: string, iv: string, salt: string) {
  const key = (await promisify(scrypt)(CRYPTO_KEY, salt, 32)) as Buffer;

  const decipher = createDecipheriv('aes-256-ctr', key, Buffer.from(iv, 'hex'));
  const decryptedText = Buffer.concat([
    decipher.update(Buffer.from(str, 'hex')),
    decipher.final(),
  ]);
  return decryptedText.toString();
}

export function hashString(
  password: string,
  salt: string,
  iterations: number = 100000,
  keyLength: number = 64,
  digest: string = 'sha512',
): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      },
    );
  });
}

export async function compareString(
  plainString: string,
  hashedString: string,
  salt: string,
  iterations: number = 100000,
  keyLength: number = 64,
  digest: string = 'sha512',
): Promise<boolean> {
  const hashedPlainString = await hashString(
    plainString,
    salt,
    iterations,
    keyLength,
    digest,
  );
  return hashedPlainString === hashedString;
}
