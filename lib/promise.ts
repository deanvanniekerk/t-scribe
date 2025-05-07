export function promiseRetry<T>(
  fn: () => Promise<T>,
  options: {
    retries: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
  },
): Promise<T> {
  const { retries, initialDelay = 2000, maxDelay = 10000, backoffFactor = 2 } = options;

  return new Promise((resolve, reject) => {
    let attempt = 0;

    const execute = () => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (attempt >= retries) {
            reject(error);
            console.error(`Failed after ${attempt} attempts:`, error);
            return;
          }

          attempt++;
          const delay = Math.min(initialDelay * backoffFactor ** (attempt - 1), maxDelay);
          setTimeout(execute, delay);
        });
    };

    execute();
  });
}

// Example usage:
/*
  async function example() {
    const fetchData = () => fetch('https://api.example.com/data').then(res => res.json());
    
    try {
      const result = await promiseRetry(fetchData, {
        retries: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        backoffFactor: 2
      });
      console.log('Success:', result);
    } catch (error) {
      console.error('Failed after retries:', error);
    }
  }
  */
