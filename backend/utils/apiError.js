class apiError extends Error{
    constructor(statusCode, message = "Something went wrong", errors = [], stack = ""){ //Giving default values for custome error to be used later
        super(message);
        this.statusCode = statusCode;
        this.data = null,
        this.errors = errors,
        this.message = message,
        this.success = false

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

module.exports = apiError