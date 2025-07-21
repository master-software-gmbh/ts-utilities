export const ElsterUebertragungsart = {
  sendAuth: 'send-Auth',
  sendNoSig: 'send-NoSig',
  sendAuthPart: 'send-Auth-Part',
} as const;

export type ElsterUebertragungsart = (typeof ElsterUebertragungsart)[keyof typeof ElsterUebertragungsart];
