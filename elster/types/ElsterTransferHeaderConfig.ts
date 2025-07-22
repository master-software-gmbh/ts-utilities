import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';

export interface ElsterTransferHeaderConfig {
  datenart: string;
  verfahren: string;
  herstellerId: string;
  datenlieferant: string;
  datenartVersion: string;
  uebertragungsart: string;
  testmerker: string | null;
  versionClient: string | null;
  verschluesselung: ElsterVerschluesselungsParameter;
}
