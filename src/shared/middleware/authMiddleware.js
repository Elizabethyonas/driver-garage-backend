/**
 * Auth middleware (skeleton).
 * Validate JWT / session and attach user to req.
 */
export function authMiddleware(req, res, next) {
  // TODO: verify token, set req.user
  next();
}
