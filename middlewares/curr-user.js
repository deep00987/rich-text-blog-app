const jwt =require('jsonwebtoken');
const { InternalServerError } = require('../error-types/server-err');
const { NotAuthoriozedError } = require('../error-types/not-authorized-err');

const currentUser = (
    req, 
    res, 
    next
) => {
    
    if (!req.session || !req.session.jwt){
        return next();
    }

    // const beararToken = req.headers['authorization']
    // if (typeof beararToken === 'undefined'){
    //     return next()
    // }

    try {

        //const token = req.headers.authorization.split(" ")[1]

        const payload = jwt.verify(
            req.session?.jwt, 
            process.env.JWT_KEY
        );

        // const payload = jwt.verify(
        //     token, 
        //     process.env.JWT_KEY
        // );
        
        if (payload.role === "admin"){
            return next();
        }
        req.currentUser = payload;
    } catch (error) {
        // throw new NotAuthoriozedError();
    }

    next();
}

const currentAdmin = (
    req, 
    res, 
    next
) => {
    if (!req.session || !req.session.jwt){
        return next();
    }
    try {
        const payload = jwt.verify(
            req.session?.jwt, 
            process.env.JWT_KEY
        );
        if (payload.role === "user"){
            return next();
        }
        console.log(payload)
        req.currentUser = payload;
    } catch (error) {
        // throw new NotAuthoriozedError();
    }
    
    next();
}

module.exports = {currentUser, currentAdmin}