export interface RetryOptions {
  retries?: number;
  initialDelay?: number;
  factor?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, delay: number, error: unknown) => void;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, initialDelay = 2000, factor = 3, maxDelay = Number.POSITIVE_INFINITY, onRetry } = options;

  let attempt = 0;
  let lastError: unknown;

  while (attempt < retries) {
    try {
      attempt++;
      return await fn();
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      lastError = err;
      if (attempt >= retries) {
        break;
      }
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

  return Promise.reject(lastError);
}
