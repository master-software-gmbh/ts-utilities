import { stringify } from './logfmt';

type Context = { [key: string]: unknown };
type Format = 'json' | 'logfmt';

export class LoggingService {
  public format: Format;

  constructor(format: Format) {
    this.format = format;
  }

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
    const data = this._data(message, level, context);

    switch (this.format) {
      case 'json':
        try {
          return JSON.stringify(data);
        } catch (error) {
          return String(data);
        }
      case 'logfmt':
        return stringify(data);
    }
  }

  _data(message: string, level: string, context: Context = {}): { [key: string]: unknown } {
    const { message: data_message, level: data_level, error, ...remaining } = context;

    const updatedContext: Context = {
      level,
      message,
      data_level,
      data_message,
      ...remaining,
    };

    if (error && error instanceof Error) {
      updatedContext['error'] = {
        name: error.name,
        stack: error.stack,
        message: error.message,
      };
    }

    return updatedContext;
  }
}

export const logger = new LoggingService('json');
