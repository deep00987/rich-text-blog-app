const express = require('express')
const jwt = require('jsonwebtoken')
const {body} = require('express-validator')
const { User } = require('./user.model')
const { BadRequestError } = require('../../../error-types/bad-req-err')
const { Password } = require('../../../utils/password')
const { currentUser } = require('../../../middlewares/curr-user')
const { validateRequest } = require('../../../middlewares/req-validation')
const { upload } = require('../../../config/multer_store')
const { isValidObjectId } = require('mongoose')
const { requireUserAuth } = require('../../../middlewares/require-auth')

const authRouter = express.Router()

authRouter.get('/current_user',
    currentUser,
    // requireAuth,
    async (req, res, next) => {
        return res.status(200).send({
            currentUser: req.currentUser || null
        })
    }   
);

authRouter.get('/user/:id',
    async (req, res) => {

        const { id } = req.params

        if (!isValidObjectId(id)) {
            throw new BadRequestError("invalid user id")
        }

        try {
            const userExists = await User.findById(id);
            if (!userExists) {
                throw new BadRequestError("user doesnt exist")
            }
            
            // blog.comments = commentsWithReplies
            res.status(200).json({ 
                "data" : { 
                    "user": {
                        username: userExists.username,
                        email: userExists.email,
                        user_id: userExists.id,
                        fullname: userExists.fullname, 
                        displayPicture: userExists?.displayPicture
                    } 
                }
            })

        } catch (error) {
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.msg)
            }
            console.error(error);
            throw new DatabaseConnectionError()
        }
    }
);

authRouter.post('/signin',
    [
        // body('fullname').exists().withMessage('full name must be there'),
        // body('username').exists().withMessage('username must be there'),
        body('email').isEmail().withMessage("email format is invalid"),
        body('password').trim().isLength({min: 4, max: 20}).withMessage("password must be bwtween 4-20 chars long")
    ], 
    validateRequest, 
    async (req, res, next) => {    
        const { email, password } = req.body;
        const userExists = await User.findOne({email})

        if (!userExists){
            throw new BadRequestError("Login credentials invalid")
        }

        const originalPassHash = userExists?.password || " ";
        const hashCheck = await Password.compare(originalPassHash, password);

        if (!hashCheck){
            throw new BadRequestError("Login credentials invalid");
        }

        const token = jwt.sign({
            id: userExists.id, 
            email: userExists.email,
            role: 'user'
        }, process.env.JWT_KEY ); 

        req.session = {
            jwt: token
        }

        res.status(200).json({ 
            "data" : { 
                user: {
                    username: userExists.username,
                    email: userExists.email,
                    user_id: userExists.id,
                    fullname: userExists.fullname, 
                    displayPicture: userExists?.displayPicture
                } 
            },
            "token": token
        })
        
    }
);

authRouter.post('/signout', 
    async (req, res, next) => {
        req.session = null;
        res.status(200).send({})
    }
);

authRouter.post('/register',
    upload.single('displayPicture'),
    [
        body('fullname').exists().isLength({min: 4}).withMessage('full name must be atleast 4 chars'),
        body('username').exists().isLength({min: 4}).withMessage('username must be atleast 4 chars'),
        body('email').isEmail().withMessage("email format is invalid"),
        body('password').trim().isLength({min: 4, max: 20}).withMessage("password must be bwtween 4-20 chars long")
    ], 
    validateRequest,
    async (req, res, next) => {

        // const { fullname, username, email, password } = req.body;
        const email = req.body.email
        const username = req.body.username
        
        console.log(req.file)

        const userExists = await User.findOne({email})
        const userNameExists = await User.findOne({username})

        if (userExists || userNameExists) {
            throw new BadRequestError("Email or username is already in use");
        }
        
        const passHash = await Password.toHashString(req.body.password);
        
        
        
        const image = req?.file ? `/uploads/${req?.file?.filename}` : " "
        

        const user = new User({
            "fullname"       : req.body.fullname,
            "username"       : req.body.username,
            "email"          : req.body.email,
            "password"       : passHash,
            "phone"          : req.body?.phone || " ",
            "displayPicture" : image,
            "authToken"      : req.body?.authToken || " ",
            "description"    : req.body?.description || " ",
        })

        const userObj = await user.save();
        
        const token = jwt.sign({
            id: user.id, 
            email: user.email,
            role: 'user'
        }, process.env.JWT_KEY ); 

        req.session = {
            jwt: token
        }

        return res.status(201).json({ 
            "data" : { 
                user: {
                    username: userObj.username,
                    email: userObj.email,
                    user_id: userObj.id,
                    fullname: userObj.fullname, 
                    displayPicture: userObj?.displayPicture
                } 
            },
            "token" : token
        })
});

authRouter.put('/user/update/:id',
    currentUser,
    requireUserAuth,
    upload.single('displayPicture'),
    [
        body('fullname').exists().isLength({min: 4}).withMessage('full name must be atleast 4 chars'),
        body('username').exists().isLength({min: 4}).withMessage('username must be atleast 4 chars'),
        body('email').isEmail().withMessage("email format is invalid"), 
    ],
    validateRequest,
    async (req, res) => {

        const { id } = req.params

        if (!isValidObjectId(id)) {
            throw new BadRequestError("invalid user id")
        }

        try {
            const userExists = await User.findById(id);

            if (!userExists) {
                throw new BadRequestError("user doesnt exist")
            }
            
            const reqEmpty = Object.values(req?.body).every(x => x === null || x === '' || x === undefined);

            if (reqEmpty) {
                throw new BadRequestError("No info received")
            }

            for await (const key of Object.keys(req.body)) {
                if (key === 'password') {
                    const passHash = await Password.toHashString(req.body[key]);
                    userExists[key] = passHash;
                    continue;
                }
                userExists[key] = req.body[key];
            }

            // userExists["displayPicture"] = req?.file ? `/uploads/${req?.file?.filename}` : " "

            userExists.save()

            res.status(200).json({
                "data" : {
                    user: {
                        username: userExists.username,
                        email: userExists.email,
                        user_id: userExists.id,
                        fullname: userExists.fullname, 
                        displayPicture: userExists?.displayPicture
                    }
                }
            })

        } catch (error) {
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.msg)
            }
            console.error(error);
            throw new DatabaseConnectionError()
        }
    }
);

authRouter.put('/user/update/pass/:id',
    currentUser,
    requireUserAuth,
    [
        body('current_pass').exists().isLength({min: 4}).withMessage('full name must be atleast 4 chars'),
        body('new_pass').exists().isLength({min: 4}).withMessage('username must be atleast 4 chars'), 
    ],
    validateRequest,
    async (req, res) => {

        const { id } = req.params

        if (!isValidObjectId(id)) {
            throw new BadRequestError("invalid user id")
        }

        try {
            const userExists = await User.findById(id);

            if (!userExists) {
                throw new BadRequestError("user doesnt exist")
            }
            
            // const reqEmpty = Object.values(req?.body).every(x => x === null || x === '' || x === undefined);
            const originalPassHash = userExists?.password || " ";
            const hashCheck = await Password.compare(originalPassHash, req?.body?.current_pass);
            
            if (!hashCheck){
                throw new BadRequestError("Login credentials invalid");
            }
            
            const passHash = await Password.toHashString(req?.body?.new_pass)
            userExists.password = passHash
            // userExists["displayPicture"] = req?.file ? `/uploads/${req?.file?.filename}` : " "
            userExists.save()

            res.status(200).json({
                "data" : {
                    user: {
                        username: userExists.username,
                        email: userExists.email,
                        user_id: userExists.id,
                        fullname: userExists.fullname, 
                        displayPicture: userExists?.displayPicture
                    }
                }
            })

        } catch (error) {
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.msg)
            }
            console.error(error);
            throw new DatabaseConnectionError()
        }
    }
);

authRouter.put('/user/update/pic/:id',
    currentUser,
    requireUserAuth,
    upload.single('displayPicture'),
    async (req, res) => {

        const { id } = req.params

        if (!isValidObjectId(id)) {
            throw new BadRequestError("invalid user id")
        }

        try {
            const userExists = await User.findById(id);

            if (!userExists) {
                throw new BadRequestError("user doesnt exist")
            }
            
            if (!req.file) {
                throw new BadRequestError("No info received")
            }

            userExists["displayPicture"] = `/uploads/${req?.file?.filename}`
            userExists.save()

            res.status(200).json({
                "data" : {
                    user: {
                        username: userExists.username,
                        email: userExists.email,
                        user_id: userExists.id,
                        fullname: userExists.fullname, 
                        displayPicture: userExists?.displayPicture
                    }
                }
            })

        } catch (error) {
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.msg)
            }
            console.error(error);
            throw new DatabaseConnectionError()
        }
    }
);




module.exports = { authRouter }