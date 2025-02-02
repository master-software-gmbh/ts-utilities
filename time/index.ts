/**
 * Returns the instant as Unix epoch time in seconds.
 * Defaults to the current time.
 */
export function unixEpoch(instant?: Date): number {
  return Math.floor((instant?.getTime() ?? Date.now()) / 1000);
}

export function daysToSeconds(days: number) {
  return hoursToSeconds(days * 24);
}

export function hoursToSeconds(hours: number) {
  return minutesToSeconds(hours * 60);
}

export function minutesToSeconds(minutes: number) {
  return minutes * 60;
}
