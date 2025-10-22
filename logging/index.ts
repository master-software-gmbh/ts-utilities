import { stringify } from './logfmt';

type Context = { [key: string]: unknown; message?: undefined; level?: undefined };
type Format = 'json' | 'logfmt';

export class LoggingService {
  public format: Format;

  constructor(format: Format) {
    this.format = format;
  }

  debug(message: string, context: Context = {}): void {
    console.debug(this._serialize('debug', message, context));
  }

  info(message: string, context: Context = {}): void {
    console.info(this._serialize('info',  message, context));
  }

  warn(message: string, context: Context = {}): void {
    console.warn(this._serialize('warn',  message, context));
  }

  error(message: string, context: Context = {}): void {
    console.error(this._serialize('error', message, context));
  }

  _serialize(level: string, message: string, context: Context = {}): string {
    const data = this._data(level, message, context);

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

  _data(level: string, message: string, context: Context = {}): { [key: string]: unknown } {  
    const updatedContext: { [key: string]: unknown } = {
      level,
      message,
      ...context,
    };

    if (context['error'] instanceof Error) {
      updatedContext['error'] = {
        name: context['error'].name,
        stack: context['error'].stack,
        message: context['error'].message,
      };
    }

    return updatedContext;
  }
}

export const logger = new LoggingService('json');
