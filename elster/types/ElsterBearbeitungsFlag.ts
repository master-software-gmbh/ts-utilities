export const ElsterBearbeitungsFlag = {
  ERIC_SENDE: 1 << 2,
  ERIC_DRUCKE: 1 << 5,
  ERIC_VALIDIERE: 1 << 1,
  ERIC_PRUEFE_HINWEISE: 1 << 7,
} as const;

export type ElsterBearbeitungsFlag = (typeof ElsterBearbeitungsFlag)[keyof typeof ElsterBearbeitungsFlag];
