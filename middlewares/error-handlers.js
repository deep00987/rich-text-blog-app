const { CustomError } = require("../error-types/custom-err");

const errHandler = (
    err, 
    req, 
    res, 
    next
) => {
    // console.log(err)
    if (err instanceof CustomError){
        return res.status(err.statusCode).send(
            {errors: err.formatedErrors()}
        );
    }
    console.log(err)
    return res.status(400).send({
        errors: [
            {
                message: "something went wrong!",
                field: "unknown"
            }
        ]
    })
}

module.exports = {errHandler}