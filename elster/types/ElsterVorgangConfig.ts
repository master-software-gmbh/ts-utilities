import type { ElsterBearbeitungsFlag } from './ElsterBearbeitungsFlag';
import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';

export interface ElsterVorgangConfig {
  bearbeitungsFlag: ElsterBearbeitungsFlag;
  datenartVersion: string;
  verschluesselung: ElsterVerschluesselungsParameter | null;
}
