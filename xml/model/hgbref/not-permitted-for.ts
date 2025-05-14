import { XsString } from '../xs/string';

export type Children = ['steuerlich' | 'Einreichung an Finanzverwaltung' | 'handelsrechtlich'];

export class HgbrefNotPermittedFor extends XsString<Children> {}
