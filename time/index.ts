import { logger } from '../logging';

export function seconds(number: number) {
  return {
    get inMilliseconds() {
      return number * 1000;
    }
  }
}

export function minutes(minutes: number) {
  return {
    ...seconds(minutes * 60),
    get inSeconds() {
      return minutes * 60;
    }
  }
}

export function hours(hours: number) {
  return {
    ...minutes(hours * 60),
    get inMinutes() {
      return hours * 60;
    },
  }
}

export function days(days: number) {
  return {
    ...hours(days * 24),
    get inHours() {
      return days * 24;
    }
  }
}

/**
 * Returns the instant as Unix epoch time in seconds.
 * Defaults to the current time.
 */
export function unixEpoch(instant?: Date): number {
  return Math.floor((instant?.getTime() ?? Date.now()) / 1000);
}

/**
 * Ensures that the execution takes at least the specified amount of time.
 * @param operation operation to run
 * @param minDuration minimum duration in milliseconds
 * @returns result of the operation
 */
export async function withConstantTime<T>(operation: () => Promise<T>, minDuration: number): Promise<T> {
  const start = Date.now();

  const [result] = await Promise.all([operation(), new Promise((resolve) => setTimeout(resolve, minDuration))]);

  const elapsed = Date.now() - start;

  if (elapsed > minDuration + 5) {
    logger.warn('Constant-time operation took longer than expected', {
      duration_ms: elapsed,
      min_duration_ms: minDuration,
    });
  }

  return result;
}

/**
 * Creates a debounced version of the given function.
 */
export function debounce<T extends Array<unknown>, U>(callback: (...args: T) => U, wait: number) {
  let timeoutId: Timer | undefined;

  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

/**
 * Creates a throttled version of the given function.
 */
export function throttle(f: Function, delay: number) {
  let ready = true;

  return (...args: any[]) => {
    if (!ready) {
      return;
    }

    ready = false;
    f(...args);
    setTimeout(() => (ready = true), delay);
  };
}

/**
 * Creates a throttled and debounced version of the given function.
 */
export function throttleDebounce<T extends (...args: any) => any>(f: T, throttleDelay: number, debounceDelay: number) {
  let lastCall = 0;
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    // Throttling
    if (now - lastCall >= throttleDelay) {
      f(...args);
      lastCall = now;
    }

    // Debouncing
    clearTimeout(timeout);
    timeout = setTimeout(() => f(...args), debounceDelay);
  };
}

export * from './ThrottledTaskQueue';