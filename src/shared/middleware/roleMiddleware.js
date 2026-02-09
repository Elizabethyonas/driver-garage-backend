/**
 * Role middleware (skeleton).
 * Restrict by role: admin, driver, garage.
 */
export function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    // TODO: check req.user.role against allowedRoles
    next();
  };
}
