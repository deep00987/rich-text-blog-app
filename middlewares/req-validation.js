const { validationResult } = require('express-validator');
const { RequestValidationError } = require('../error-types/req-validation-err');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    // console.log(errors)

    if (!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }

    next();
}
module.exports = {validateRequest}