const express = require('express')
const Blog = require('../blog/blog.model')
const Comment = require('../comment/comment.model')
const {User} = require('../auth/user.model')
const {body} = require('express-validator')
const { validateRequest } = require('../../../middlewares/req-validation')
const { BadRequestError } = require('../../../error-types/bad-req-err')
const { DatabaseConnectionError } = require('../../../error-types/db-connection-err')
const { currentUser } = require('../../../middlewares/curr-user')
const { requireUserAuth } = require('../../../middlewares/require-auth')
const commentRouter = express.Router()
const ObjectId = require('mongoose').Types.ObjectId

commentRouter.post('/add', 
    currentUser,
    requireUserAuth,
    [
        body("body").exists().isString().isLength({min: 1}).withMessage("comment body required"),
        body("blogId").exists().isString()
        .isLength({min: 24, max: 24}).matches(/^[a-f\d]{24}$/i).withMessage("invalid id")
    ],
    validateRequest,
    async(req, res) => {

        const blogId = req.body?.blogId
        
        if (!isValidObjectId(blogId)) {
            throw new BadRequestError("invalid blog id")
        }

        const blogExsist = await Blog.findById(blogId)

        if(!blogExsist){
            throw new BadRequestError("invalid request")
        }

        try {
                        
            const userName = await User.findById(req.currentUser.id)

            const comment = new Comment({
                blogId,
                userId: req.currentUser.id,
                userName: userName.username,
                body: req.body.body
            });

            // Save the comment to the database
            await comment.save();

            res.status(201).json({ message: 'Comment added successfully', comment });
        } catch (error) {
            console.error('Error adding comment:', error);
            throw new DatabaseConnectionError()
        }
    }
)

commentRouter.put('/update/:cid', 
    currentUser,
    requireUserAuth,
    [
        body("body").exists().isString().withMessage("comment body required"),
    ],
    validateRequest,
    async(req, res) => {
        
        const commentId = req.params?.cid;

        if (!isValidObjectId(commentId)) {
            throw new BadRequestError("invalid comment id")
        }

        try {
           
            const comment = await Comment.findOne({_id: commentId, userId: req.currentUser?.id});

            if (!comment) {
                throw new BadRequestError("Invalid request")
            }

            comment.body = req.body?.body;

            await comment.save();

            res.status(200).json({ message: 'Comment updated successfully', comment });
        
        } catch (error) {
            console.error('Error updating comment:', error);
            throw new BadRequestError(error.msg)
        }
        
    }
)

commentRouter.delete('/delete/:cid', 
    currentUser,
    requireUserAuth,

    async(req, res) => {
        const commentId = req.params?.cid;

        if (!isValidObjectId(commentId)) {
            throw new BadRequestError("invalid comment id")
        }

        try {
    
            const comment = await Comment.findById(commentId);
            if (!comment) {
                throw new BadRequestError("comment not found")
            }

            if (comment.userId.toString() !== req.currentUser.id) {
                throw new BadRequestError("Invalid request")
            }

            const deletedComment = await Comment.deleteOne({_id: commentId});

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

commentRouter.put('/like/:id', 
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
            const comment = await Comment.findById(id);
            if (!comment) {
                throw new BadRequestError("comment not found")
            }

            const likeIndex = comment.likes.findIndex(like => like.toString() === req.currentUser.id)

            if (likeIndex > -1) {
    
                comment.likeCount -= 1;
                comment.likes.splice(likeIndex, 1);
                
            } else {
                
                comment.likeCount += 1;
                comment.likes.push(req.currentUser.id);

            }

            await comment.save();
            res.status(200).json(comment);

        } catch (error) {
            console.error(error);
            if ( error instanceof BadRequestError ){
                throw new BadRequestError(error.msg)
            }
            throw new DatabaseConnectionError(error.msg)
        }
    }
)


// commentRouter.get('/:id/comments', 
//     async(req, res) => {
//         res.send("ok")
//     }
// )

function isValidObjectId(id){
    
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}


module.exports = { commentRouter, isValidObjectId }