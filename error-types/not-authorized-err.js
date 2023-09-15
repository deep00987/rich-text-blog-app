const { CustomError } = require("./custom-err");

class NotAuthoriozedError extends CustomError {
    statusCode = 401;
    message;
    constructor(msg){
        super(msg || "Not authorized");
        this.message = msg || "Not authorized";
        Object.setPrototypeOf(this, NotAuthoriozedError.prototype);
    }
    formatedErrors(){
        return [
            {
                message: this.message
            }
        ]
    }
}

module.exports = {NotAuthoriozedError}