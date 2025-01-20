export function unixEpoch(): number {
  return Math.floor(Date.now() / 1000);
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
