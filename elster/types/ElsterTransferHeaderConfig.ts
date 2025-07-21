import type { ElsterDatenart } from './ElsterDatenart';
import type { ElsterUebertragungsart } from './ElsterUebertragungsart';
import type { ElsterVerfahren } from './ElsterVerfahren';
import type { ElsterVerschluesselungsParameter } from './ElsterVerschluesselungsParameter';

export interface ElsterTransferHeaderConfig {
  herstellerId: string;
  datenart: ElsterDatenart;
  datenartVersion: string;
  datenLieferant: string;
  versionClient: string;
  testmarker: string | null;
  verfahren: ElsterVerfahren;
  encryption: ElsterVerschluesselungsParameter;
  uebertragungsart: ElsterUebertragungsart;
}
