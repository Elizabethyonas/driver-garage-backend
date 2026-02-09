/**
 * Simple logger (placeholder).
 * Replace with pino/winston when needed.
 */
export const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
};
