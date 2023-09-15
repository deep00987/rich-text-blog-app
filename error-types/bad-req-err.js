const { CustomError } = require("./custom-err");

class BadRequestError extends CustomError{
    statusCode = 400;
    msg;
    constructor(msg){
        super(msg);
        if (msg === undefined || msg === null || msg === ''){ msg = "Bad request" }
        this.msg = msg;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    formatedErrors(){
        return [
            {
                message: this.msg,
            }
        ]
    }

}

module.exports = {BadRequestError}