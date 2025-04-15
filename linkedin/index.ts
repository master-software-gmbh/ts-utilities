/**
 * Parses the LinkedIn username from the given input.
 * The input can be a full URL or just the username.
 *
 * @param input input to parse from
 * @returns extracted username or null if not found
 */
export function parseUsername(input: string): string | null {
  if (input.length > 2048) {
    return null;
  }

  return /([^\/]+)[\/]?$/.exec(input)?.at(1) ?? null;
}
