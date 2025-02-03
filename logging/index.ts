import type { JSONObject } from '../json';
import { stringify } from './logfmt';

export class LoggingService {
  constructor(public format: 'json' | 'logfmt' = 'logfmt') {}

  debug(message: string, data: JSONObject = {}): void {
    console.debug(this._serialize(message, data));
  }

  info(message: string, data: JSONObject = {}): void {
    console.info(this._serialize(message, data));
  }

  warn(message: string, data: JSONObject = {}): void {
    console.warn(this._serialize(message, data));
  }

  error(message: string, data: JSONObject = {}): void {
    console.error(this._serialize(message, data));
  }

  _serialize(message: string, properties: JSONObject = {}): string {
    const data = { message, ...properties };

    switch (this.format) {
      case 'json':
        return JSON.stringify(data);
      case 'logfmt':
        return stringify(data);
    }
  }
}

export const logger = new LoggingService('logfmt');
