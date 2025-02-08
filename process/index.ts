import { logger } from "../logging";

/**
 * Sets up handlers for termination signals and calls
 * the provided function to ensure a graceful shutdown.
 * @param terminate function to call on termination
 */
export function gracefulTermination(terminate: () => Promise<void>) {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGABRT']) {
    process.once(signal, async () => {
      logger.info('Received termination signal', { signal });
      await terminate();
      process.exit(0);
    });
  }
}
