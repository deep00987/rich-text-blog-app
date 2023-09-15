
const { CustomError } = require('./custom-err');

class RequestValidationError extends CustomError{

    statusCode = 400;
    f_Error
    constructor(errors){
        super("invalid request parameters");
        this.f_Error = errors || []
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    formatedErrors() {
        
        return this.f_Error.map(err => {
            return {
                message: err?.msg || "something went wrong",
                type: err?.type || "unkonwn",
                param: err?.path || "unkonwn"

            }
        })
    }
}

module.exports = {RequestValidationError}
