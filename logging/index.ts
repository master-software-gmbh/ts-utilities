import { stringify } from './logfmt';

type Context = { [key: string]: unknown };

export class LoggingService {
  constructor(public format: 'json' | 'logfmt' = 'logfmt') {}

  debug(message: string, context: Context = {}): void {
    console.debug(this._serialize(message, 'debug', context));
  }

  info(message: string, context: Context = {}): void {
    console.info(this._serialize(message, 'info', context));
  }

  warn(message: string, context: Context = {}): void {
    console.warn(this._serialize(message, 'warn', context));
  }

  error(message: string, context: Context = {}): void {
    console.error(this._serialize(message, 'error', context));
  }

  _serialize(message: string, level: string, context: Context = {}): string {
    const data = { message, level, ...context };

    switch (this.format) {
      case 'json':
        return JSON.stringify(data);
      case 'logfmt':
        return stringify(data);
    }
  }
}

export const logger = new LoggingService('logfmt');
