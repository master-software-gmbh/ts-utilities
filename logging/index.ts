import type { JSONObject } from '../json';
import { stringify } from './logfmt';

export class LoggingService {
  constructor(public format: 'json' | 'logfmt' = 'logfmt') {}

  debug(message: string, data: JSONObject = {}): void {
    console.debug(this._serialize(message, 'debug', data));
  }

  info(message: string, data: JSONObject = {}): void {
    console.info(this._serialize(message, 'info', data));
  }

  warn(message: string, data: JSONObject = {}): void {
    console.warn(this._serialize(message, 'warn', data));
  }

  error(message: string, data: JSONObject = {}): void {
    console.error(this._serialize(message, 'error', data));
  }

  _serialize(message: string, level: string, properties: JSONObject = {}): string {
    const data = { message, level, ...properties };

    switch (this.format) {
      case 'json':
        return JSON.stringify(data);
      case 'logfmt':
        return stringify(data);
    }
  }
}

export const logger = new LoggingService('logfmt');
