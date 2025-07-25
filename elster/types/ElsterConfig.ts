import type { ElsterLogsConfig } from './ElsterLogsConfig';

export type ElsterConfig = ElsterLogsConfig & {
  libraryFilepath: string;
  printFusstext: string | null;
};
