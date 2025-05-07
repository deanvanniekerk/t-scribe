/**
 * Retry a promise-returning function with incremental (exponential) backoff.
 */

export interface RetryOptions {
  /**
   * Maximum number of attempts (including the first).
   * Default: 3
   */
  retries?: number;
  /**
   * Initial delay in milliseconds before the first retry.
   * Default: 500
   */
  initialDelay?: number;
  /**
   * Backoff multiplier factor.
   * delay_n = initialDelay * factor^(n-1)
   * Default: 2
   */
  factor?: number;
  /**
   * Maximum delay in milliseconds between retries.
   * Default: Infinity (no cap)
   */
  maxDelay?: number;
  /**
   * Optional callback invoked before each retry attempt.
   */
  onRetry?: (attempt: number, delay: number, error: unknown) => void;
}

/**
 * Returns a promise that resolves after a given number of milliseconds.
 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retries a promise-returning function according to provided backoff options.
 *
 * @param fn - A function returning a promise to retry.
 * @param options - Configuration for retry behavior.
 * @returns A promise that resolves to the function's result or rejects with the last error.
 */
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, initialDelay = 2000, factor = 3, maxDelay = Number.POSITIVE_INFINITY, onRetry } = options;

  let attempt = 0;
  let lastError: unknown;

  while (attempt < retries) {
    try {
      attempt++;
      console.log(`Attempt ${attempt}...`);
      return await fn();
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      lastError = err;
      if (attempt >= retries) {
        break;
      }
      // Calculate incremental (exponential) backoff delay
      const delay = Math.min(initialDelay * factor ** (attempt - 1), maxDelay);
      if (onRetry) {
        try {
          onRetry(attempt, delay, err);
        } catch {
          // swallow errors in onRetry handler
        }
      }
      await wait(delay);
    }
  }

  // All attempts failed; reject with last encountered error
  return Promise.reject(lastError);
}

/**
 * Example usage:
 *
 * import { retry } from './retry';
 *
 * async function unstableFetch(): Promise<string> {
 *   // simulate a fetch that may fail
 *   if (Math.random() < 0.7) {
 *     throw new Error('Random failure');
 *   }
 *   return 'Success!';
 * }
 *
 * (async () => {
 *   try {
 *     const result = await retry(unstableFetch, {
 *       retries: 5,
 *       initialDelay: 300,
 *       factor: 1.5,
 *       maxDelay: 5000,
 *       onRetry: (attempt, delay, err) => {
 *         console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`, err);
 *       },
 *     });
 *     console.log('Result:', result);
 *   } catch (err) {
 *     console.error('All retries failed:', err);
 *   }
 * })();
 */
