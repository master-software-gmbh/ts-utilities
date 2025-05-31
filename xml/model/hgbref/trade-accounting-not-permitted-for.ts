import { XsString } from '../xs/string';

export type Children = [
  'handelsrechtlich' | 'handelsrechtlicher Einzelabschluss' | 'handelsrechtlicher Konzernabschluss',
];

export class HgbrefTradeAccountingNotPermittedFor extends XsString<Children> {}
