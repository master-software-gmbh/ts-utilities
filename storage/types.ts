import { resolve } from 'node:path';

export class Folder {
  segments: string[];

  constructor(...segments: string[]) {
    this.segments = segments;
  }

  get path(): string {
    return resolve(...this.segments);
  }
}

export class FileContent {
  readonly url?: string;
  readonly type?: string;
  readonly stream: ReadableStream;

  constructor(source: ReadableStream, type?: string, url?: string) {
    this.url = url;
    this.type = type;
    this.stream = source;
  }
}
