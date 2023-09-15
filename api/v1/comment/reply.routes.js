const express = require('express')
const Blog = require('../blog/blog.model')
const Comment = require('../comment/comment.model')
const Reply = require('./reply.model')
const { isValidObjectId } = require('./comment.routes') 
const {User} = require('../auth/user.model')
const {body} = require('express-validator')
const { validateRequest } = require('../../../middlewares/req-validation')
const { BadRequestError } = require('../../../error-types/bad-req-err')
const { DatabaseConnectionError } = require('../../../error-types/db-connection-err')
const { currentUser } = require('../../../middlewares/curr-user')
const { requireUserAuth } = require('../../../middlewares/require-auth')
const replyRouter = express.Router()
const ObjectId = require('mongoose').Types.ObjectId

replyRouter.post('/add', 
    currentUser,
    requireUserAuth,
    [
        body("body").exists().isString().withMessage("comment body required"),
        body("commentId").exists().isString()
        .isLength({min: 24, max: 24}).matches(/^[a-f\d]{24}$/i).withMessage("invalid id")
    ],
    validateRequest,
    async(req, res) => {

        try {

            const commentId = req.body?.commentId
            const commentExists = await Comment.findById(commentId)

            if(!commentExists){
                throw new BadRequestError("Comment doesnt exist")
            }

            const userName = await User.findById(req.currentUser.id)
            const reply = new Reply({
                commentId,
                userId: req.currentUser.id,
                userName: userName.username,
                body: req.body.body
            });

            await reply.save();

            res.status(201).json({ message: 'Comment added successfully', reply });
        } catch (error) {
            console.error('Error adding comment:', error);
            
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.msg)
            }
            
            throw new DatabaseConnectionError()
        }
    }
)

replyRouter.put('/update/:rid', 
    currentUser,
    requireUserAuth,
    [
        body("body").exists().isString().withMessage("comment body required"),
    ],
    validateRequest,
    async(req, res) => {
        
        try {
            const replyId = req.params?.rid;

            if (!isValidObjectId(replyId)) {
                throw new BadRequestError("invalid comment id")
            }
            
            const reply = await Reply.findOne({_id: replyId, userId: req.currentUser?.id});

            if (!reply) {
                throw new BadRequestError("Invalid request")
            }

            reply.body = req.body?.body;

            await reply.save();

            res.status(200).json({ message: 'comment updated successfully', reply });
        
        } catch (error) {
            console.error('Error updating comment:', error);
            
            if (error instanceof BadRequestError){
                throw new BadRequestError(error.msg)
            }
            
            throw new DatabaseConnectionError()
        }
    }
)

replyRouter.delete('/delete/:rid', 
    currentUser,
    requireUserAuth,

    async(req, res) => {
        const replyId = req.params?.rid;

        if (!isValidObjectId(replyId)) {
            throw new BadRequestError("invalid comment id")
        }

        try {
    
            const reply = await Reply.findById(replyId);
            if (!reply) {
                throw new BadRequestError("comment not found")
            }

            if (reply.userId.toString() !== req.currentUser.id) {
                throw new BadRequestError("Invalid request")
            }

            const deletedReply = await Reply.deleteOne({_id: replyId});

            res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error(error);
            if (error instanceof BadRequestError) {
                throw new BadRequestError(error.msg)
            }else{
                throw new DatabaseConnectionError()
            }
        }
    }
)

replyRouter.put('/like/:id', 
    currentUser,
    requireUserAuth,

    async(req, res) => {
        /**
         * if liked -> decr like count remove like entry wrt current user
         * if not liked -> incr count add like entry wrt current user
         */
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            throw new BadRequestError("invalid comment id")
        }

        try {
            // Find the comment by ID
            const reply = await Reply.findById(id);
            if (!reply) {
                throw new BadRequestError("comment not found")
            }

            const likeIndex = reply.likes.findIndex(like => like.toString() === req.currentUser.id)

            if (likeIndex > -1) {
    
                reply.likeCount -= 1;
                reply.likes.splice(likeIndex, 1);
                
            } else {
                
                reply.likeCount += 1;
                reply.likes.push(req.currentUser.id);

            }

            await reply.save();
            res.status(200).json(reply);

        } catch (error) {
            console.error(error);
            if ( error instanceof BadRequestError ){
                throw new BadRequestError(error.msg)
            }
            throw new DatabaseConnectionError(error.msg)
        }
    }
)

module.exports = { replyRouter }

