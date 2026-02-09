/**
 * Reads env vars with optional default.
 */
export function getEnv(key, defaultValue) {
  const value = process.env[key];
  if (value === undefined || value === '') return defaultValue;
  return value;
}
