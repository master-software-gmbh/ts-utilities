/**
 * Task queue that throttles execution of tasks at a specified interval.
 * All tasks are executed in the order they are added to the queue.
 */
export class ThrottledTaskQueue {
  private isProcessing = false;
  private readonly interval: number;
  private readonly queue: (() => Promise<unknown>)[];

  constructor(interval: number) {
    this.queue = [];
    this.interval = interval;
  }

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve).catch(reject));
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const nextTask = this.queue.shift();

      if (nextTask) {
        await nextTask();
        await new Promise((r) => setTimeout(r, this.interval));
      }
    }

    this.isProcessing = false;
  }
}
