export type ElsterLogCallback = (
  kategorie: string,
  loglevel: number,
  nachricht: string,
  benutzerdaten: unknown,
) => void;
