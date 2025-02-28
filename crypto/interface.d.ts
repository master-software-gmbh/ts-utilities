export interface CryptoHasher {
  /**
   * Hashes a password.
   * @param password The password to hash.
   * @returns The password hash.
   */
  hash(password: string): Promise<string>;

  /**
   * Compares a password with a hash.
   * @param password The password to compare.
   * @param hash The hash to compare with.
   * @returns Whether the password matches the hash.
   */
  compare(password: string, hash: string): Promise<boolean>;
}
