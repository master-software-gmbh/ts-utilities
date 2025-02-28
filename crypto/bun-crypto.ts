import type { Password } from 'bun';
import type { CryptoHasher } from './interface';

/**
 * A `CryptoHasher` implementation that uses the native `bun` functions.
 * Supports different algorithms:
 * - `bcrypt`
 * - `argon2id`
 * - `argon2d`
 * - `argon2i`
 */
export class BunCryptoHasher implements CryptoHasher {
  private readonly algorithm: Password.AlgorithmLabel;

  constructor(algorithm: Password.AlgorithmLabel) {
    this.algorithm = algorithm;
  }

  async hash(password: string): Promise<string> {
    return Bun.password.hash(password, this.algorithm);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return Bun.password.verify(password, hash, this.algorithm);
  }
}
