import { ReplayableStream } from '../stream';
import type { ReadableStream } from 'node:stream/web';

export class Folder {
  segments: string[];

  constructor(...segments: string[]) {
    this.segments = segments;
  }

  static ROOT = new Folder();

  resolve(key: string): string {
    return [...this.segments, key].join('/');
  }

  get path(): string {
    return this.segments.join('/');
  }
}

export class FileContent {
  readonly url?: string;
  readonly type?: string;
  private readonly source: ReplayableStream;

  get stream(): ReadableStream {
    return this.source.getStream();
  }

  constructor(source: ReadableStream, type?: string, url?: string) {
    this.url = url;
    this.type = type;
    this.source = new ReplayableStream(source);
  }
}
