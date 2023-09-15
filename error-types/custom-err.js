/**
 * Abstract class CustomError
 * 
 * @class CustomError
 */
class CustomError extends Error{
    
    statusCode;
    
    constructor(msg){
        super(msg);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    formatedErrors(){}
    /**
     * return type json =>
     * [    
     *      {
                message,
                type | (optional)
            }
        ]
     */

}

module.exports = {CustomError}