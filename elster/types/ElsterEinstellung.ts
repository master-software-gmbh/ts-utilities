export const ElsterEinstellung = {
  detailedLog: 'log.detailed',
} as const;

export type ElsterEinstellung = (typeof ElsterEinstellung)[keyof typeof ElsterEinstellung];
