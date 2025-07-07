import type { Readable } from 'node:stream';
import { ReadableStream, type ReadableStreamDefaultReader } from 'node:stream/web';

/**
 * Converts a Node.js Readable stream to a ReadableStream.
 */
export function convertReadable(nodeStream: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk) => controller.enqueue(chunk));
      nodeStream.on('end', () => controller.close());
      nodeStream.on('error', (err) => controller.error(err));
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

export class ReplayableStream<T = any> {
  private state?: 'started' | 'done';
  private buffer: T[] = [];
  private readers: Array<(chunk: T | null) => void> = [];
  private sourceReader: ReadableStreamDefaultReader<T>;

  constructor(source: ReadableStream<T>) {
    this.sourceReader = source.getReader();
  }

  get started(): boolean {
    return this.state === 'started';
  }

  get done(): boolean {
    return this.state === 'done';
  }

  private startReading() {
    if (this.started) return;
    this.state = 'started';

    (async () => {
      while (true) {
        const { value, done } = await this.sourceReader.read();
        if (done) break;

        this.buffer.push(value);

        for (const push of this.readers) {
          push(value);
        }
      }

      this.state = 'done';

      for (const push of this.readers) {
        push(null);
      }

      this.readers = [];
    })();
  }

  /**
   * Returns a new ReadableStream that replays buffered chunks and streams new ones.
   */
  getStream(): ReadableStream<T> {
    this.startReading();

    return new ReadableStream<T>({
      start: (controller) => {
        let closed = false;

        // Replay already-buffered chunks
        for (const chunk of this.buffer) {
          controller.enqueue(chunk);
        }

        if (this.done) {
          controller.close();
          closed = true;
          return;
        }

        const push = (chunk: T | null) => {
          if (closed) return;

          if (chunk === null) {
            controller.close();
            closed = true;
          } else {
            controller.enqueue(chunk);
          }
        };

        this.readers.push(push);
      },
    });
  }
}
