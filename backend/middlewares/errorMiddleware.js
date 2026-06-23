const apiError = require('../utils/apiError');

const errorHandler = (err, req, res, next) => {

    if(err instanceof apiError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    return res.status(500).json({  //555 status code to mark the actual return point of error
        success: false,
        message: err.message || "Internal Server Error. End of the line."
    });
};

module.exports = errorHandler;