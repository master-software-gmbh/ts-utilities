import type { ElsterBearbeitungsFlag } from './ElsterBearbeitungsFlag';
import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';

export interface ElsterVorgangConfig {
  datenartVersion: string;
  transferHandle: Uint32Array | null;
  bearbeitungsFlag: ElsterBearbeitungsFlag;
  verschluesselung: ElsterVerschluesselungsParameter | null;
}
