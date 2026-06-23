const apiError = require('../utils/apiError');

module.exports = (...roles) => {
    return (req, res, next) => {
        try {

            if (!req.user) {
                throw new apiError(401, 'Unauthorized. Please login first.');
            }

            if (!roles.includes(req.user.role)) {
                throw new apiError(403, "Access denied. You don't have required role.");
            }

            next();

        } catch (err) {
            next(err);
        }
    };
};