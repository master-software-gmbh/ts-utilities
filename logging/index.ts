import type { JSONObject } from '../json';

export class LoggingService {
  constructor(private readonly format: 'structured' | 'readable' = 'structured') {}

  debug(message: string, data: JSONObject = {}): void {
    console.debug(this.serialize(message, data));
  }

  info(message: string, data: JSONObject = {}): void {
    console.info(this.serialize(message, data));
  }

  warn(message: string, data: JSONObject = {}): void {
    console.warn(this.serialize(message, data));
  }

  error(message: string, data: JSONObject = {}): void {
    console.error(this.serialize(message, data));
  }

  private serialize(message: string, properties: JSONObject = {}): string {
    return this.format === 'structured'
      ? this.serializeStructured(message, properties)
      : this.serializeReadable(message, properties);
  }

  private serializeReadable(message: string, properties: JSONObject = {}): string {
    return `${message}\n  ${Object.entries(properties)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join('\n  ')}\n`;
  }

  private serializeStructured(message: string, properties: JSONObject = {}): string {
    return JSON.stringify({ message, ...properties });
  }
}

export const logger = new LoggingService('readable');
