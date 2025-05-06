export const ConsentStatus = {
  Denied: 'denied',
  Granted: 'granted',
};

export type ConsentStatus = (typeof ConsentStatus)[keyof typeof ConsentStatus];
