import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';

export interface ElsterTransferHeaderConfig {
  datenart: string;
  verfahren: string;
  versionClient: string;
  herstellerId: string;
  datenLieferant: string;
  datenartVersion: string;
  testmerker: string | null;
  uebertragungsart: string;
  verschluesselung: ElsterVerschluesselungsParameter;
}
