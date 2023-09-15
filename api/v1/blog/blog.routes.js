const express = require('express')
const Blog = require('./blog.model')
const Category = require('../category/category.model')
const Comment = require('../comment/comment.model')
const Reply = require('../comment/reply.model')
const path = require("path")
const {User} = require('../auth/user.model')
const {body} = require('express-validator')
const { validateRequest } = require('../../../middlewares/req-validation')
const { upload } = require('../../../config/multer_store')
const { BadRequestError } = require('../../../error-types/bad-req-err')
const { DatabaseConnectionError } = require('../../../error-types/db-connection-err')
const { currentUser } = require('../../../middlewares/curr-user')
const { requireUserAuth } = require('../../../middlewares/require-auth')
const { isValidObjectId } = require('mongoose')
const blogRouter = express.Router()
const fs = require('fs')
const url = require('url');
const querystring = require('querystring');


blogRouter.post('/add',
    currentUser,
    requireUserAuth,
    upload.array('images'),
    [
        body("title").exists().notEmpty().withMessage("blog title required"),
        body("body").exists().notEmpty().withMessage("body required"),
        body("categories").isString().notEmpty().withMessage("category required"),
        body("tags").isString().notEmpty().withMessage("tags required"),
    ],
    validateRequest,

    async (req, res) => {

        const categories = req.body.categories.split(",")
        const tags = req.body.tags.split(",")
        let categoryData = []
        const images = []

        try {
            categoryData = await checkAndUpdateCategories(categories)
        } catch (error) {
            console.log(error)
            throw new DatabaseConnectionError()
        }

        console.log(categoryData)

        req?.files.forEach(element => {
            images.push(`/uploads/${element.filename}`)
        });

        try {
            var blog = new Blog({
                title        : req.body.title,
                body         : req.body.body,
                images       : images,
                authorId     : req.currentUser.id,
                categories   : categoryData,
                tags         : tags
            })
            await blog.save()
        } catch (error) {
            console.log(error)
            throw new BadRequestError("invalid data")
        }

        res.status(200).json({
            "data": blog
        })

    }
)

blogRouter.put('/update/:id',
    currentUser,
    requireUserAuth,
    upload.array("images"),
    [
        body("title").exists().notEmpty().withMessage("blog title required"),
        body("body").exists().notEmpty().withMessage("body required"),
        body("categories").isString().notEmpty().withMessage("category required"),
        body("tags").isString().notEmpty().withMessage("tags required"),
    ],
    validateRequest,
    async(req, res)=>{
        const id = req.params?.id
        let blogData;
        let images = []
        try {
            blogData = await Blog.findOne({_id: id, authorId: req?.currentUser.id})
        } catch (error) {
            console.log(error)
            throw new DatabaseConnectionError()
        }

        if (!blogData) {
            throw new BadRequestError("invalid request")
        }

        for await (const key of Object.keys(req.body)) {

            if (key === "body") {

                blogData["body"] = req.body[key];
                // blogData["bodyMarkDown"] = req.body[key];

            } else if (key === "categories") {
                const categories = req.body[key].split(",");

                let categoryData = [];
                categoryData = await checkAndUpdateCategories(categories)
                blogData["categories"] = categoryData;

            } else if (key === "tags") {
                const tags = req.body[key].split(",");
                blogData["tags"] = tags;
            } else {
                blogData[key] = req.body[key];
            }
        }

        req?.files.forEach(element => {
            images.push(`/uploads/${element.filename}`)
        });

        blogData["images"] = images

        await blogData.save()

        res.status(200).json({
            "data": blogData
        })
    }
)

blogRouter.get('/user_blogs',
    currentUser,
    requireUserAuth,

    async (req, res) => {

        try {
            var blogs = await Blog.find({authorId: req?.currentUser.id})
        } catch (error) {
            throw new DatabaseConnectionError()
        }

        res.status(200).json({blogs})

    }
)

blogRouter.get('/all',
    async (req, res) => {
        try {
            var blogs = await Blog.find()
        } catch (error) {
            throw new DatabaseConnectionError()
        }

        res.status(200).json({blogs})

    }
)

blogRouter.put('/like/:id',
    currentUser,
    requireUserAuth,

    async (req, res) => {
        const user_id = req?.currentUser.id;
        const post_id = req.params.id;

        try {
            const blog = await Blog.findById(post_id);
            if (!blog) {
                throw new BadRequestError("Blog doesn't exist");
            }

            const likedIndex = blog.likes.findIndex((userId) => userId.toString() === user_id);
            const dislikedIndex = blog.dislikes.findIndex((userId) => userId.toString() === user_id);

            if (likedIndex === -1 && dislikedIndex === -1) {
                // If not liked and not disliked
                blog.likeCount += 1;
                blog.likes.push(user_id);
            } else if (likedIndex === -1 && dislikedIndex !== -1) {
                // If not liked and disliked
                blog.dislikeCount -= 1;
                blog.dislikes.splice(dislikedIndex, 1);
                blog.likeCount += 1;
                blog.likes.push(user_id);
            } else if (likedIndex !== -1 && dislikedIndex === -1) {
                // If liked and not disliked
                blog.likeCount -= 1;
                blog.likes.splice(likedIndex, 1);
            } else if (likedIndex !== -1 && dislikedIndex !== -1) {
                // if code reachs here, something broke
                // blog.likeCount -= 1;
                // blog.likes.splice(likedIndex, 1);
                // blog.dislikeCount -= 1;
                // blog.dislikes.splice(dislikedIndex, 1);
            }

            const updatedBlog = await blog.save();
            res.status(200).json(updatedBlog);
        } catch (error) {
            console.log(error)
            throw new BadRequestError("something went wrong")
        }
    }
)

blogRouter.put('/dislike/:id',
    currentUser,
    requireUserAuth,

    async (req, res) => {
        const user_id = req?.currentUser.id;
        const post_id = req.params.id;

        try {
            const blog = await Blog.findById(post_id);
            if (!blog) {
                throw new BadRequestError("Blog doesn't exist");
            }

            const likedIndex = blog.likes.findIndex((userId) => userId.toString() === user_id);
            const dislikedIndex = blog.dislikes.findIndex((userId) => userId.toString() === user_id);

            if (likedIndex === -1 && dislikedIndex === -1) {
                // If not liked and not disliked
                blog.dislikeCount += 1;
                blog.dislikes.push(user_id);
            } else if (likedIndex === -1 && dislikedIndex !== -1) {
                // If not liked and disliked
                blog.dislikeCount -= 1;
                blog.dislikes.splice(dislikedIndex, 1);
            } else if (likedIndex !== -1 && dislikedIndex === -1) {
                // If liked and not disliked
                blog.likeCount -= 1;
                blog.likes.splice(likedIndex, 1);
                blog.dislikeCount += 1;
                blog.dislikes.push(user_id);
            } else if (likedIndex !== -1 && dislikedIndex !== -1) {
                // if code reachs here, something broke
                // blog.likeCount -= 1;
                // blog.likes.splice(likedIndex, 1);
                // blog.dislikeCount -= 1;
                // blog.dislikes.splice(dislikedIndex, 1);
            }

            const updatedBlog = await blog.save();
            res.status(200).json(updatedBlog);
        } catch (error) {
            console.log(error)
            throw new BadRequestError("something went wrong")
        }
    }
)

blogRouter.delete('/delete/:id',
    currentUser,
    requireUserAuth,

    async(req, res) => {
        const id = req.params.id
        const user_id = req.currentUser.id
        const filePath = path.join(__dirname, '../../../').slice(0, -1);
        console.log(filePath)
        try {
            var deletedBlog = await Blog.findOneAndDelete({_id: id, authorId: user_id})
        } catch (error) {
            throw new DatabaseConnectionError()
        }

        if (!deletedBlog) {
            throw new BadRequestError("invlid request")
        }

        const blogImages = deletedBlog.images

        blogImages.forEach((imgLink) => {
            const imgPath = filePath + imgLink
            fs.unlinkSync(imgPath)
            console.log(imgPath, "::: deleted")
        })


        res.status(200).json({
            "msg": "blog deleted",
            "data": deletedBlog
        })

    }
)


blogRouter.get('/:id/comments',
    async(req, res) => {

        const { id } = req.params

        if (!isValidObjectId(id)){
            throw new BadRequestError("invalid blog id")
        }

        try {
            const blog = await Blog.findById(id);
            if (!blog) {
                throw new BadRequestError("blog doesnt exist")
            }

            const comments = await Comment.find({ blogId: id });
            const commentsWithReplies = await Promise.all(
                comments.map( async (comment) => {
                    const replies = await Reply.find({ commentId: comment._id });
                    const userInfo = await User.findById(comment.userId)
                    
                    return { 
                        comment, 
                        replies, 
                        user: {
                            userName: userInfo?.username,
                            displayPicture: userInfo?.displayPicture
                        } 
                    };
                })
            );

            res.status(200).json({ comments: commentsWithReplies });

        } catch (error) {
            if ( error instanceof BadRequestError ){
                throw new BadRequestError(error.msg)
            }
            console.error(error);
            throw new DatabaseConnectionError()
        }
    }
)

blogRouter.get('/filter',
    async (req, res) => {
        let parsedUrl = url.parse(req.url, true)
        // let category = querystring.parse(parsedUrl.query);
        let category = parsedUrl?.query?.category
        console.log(parsedUrl)
        console.log(category)
        try {
            var blogs = await Blog.find()
        } catch (error) {
            throw new DatabaseConnectionError()
        }
        // console.log(blogs)
        if (!category){
            return res.status(200).json({blogs})
        }

        const filteredBlogs = blogs.filter((blog) => {
            return blog.categories.some((cat) => cat.name === category);
        });

        return res.status(200).json({blogs: filteredBlogs})
    }
)

/**
 * testing comit 
 */

blogRouter.get('/:id',
    async(req, res) => {

        const { id } = req.params

        if (!isValidObjectId(id)){
            throw new BadRequestError("invalid blog id")
        }

        try {
            const blog = await Blog.findById(id);
            if (!blog) {
                throw new BadRequestError("blog doesnt exist")
            }

            const comments = await Comment.find({ blogId: id });
            
            const commentsWithReplies = await Promise.all(
                comments.map( async (comment) => {
                    const replies = await Reply.find({ commentId: comment._id });
                    const userInfo = await User.findById(comment.userId)

                    return { 
                        comment, 
                        replies, 
                        user: {
                            userName: userInfo?.username,
                            displayPicture: userInfo?.displayPicture || []
                        } 
                    };
                })
            );

            // blog.comments = commentsWithReplies

            res.status(200).json({ blog, comments: commentsWithReplies });

        } catch (error) {
            if ( error instanceof BadRequestError ){
                throw new BadRequestError(error.msg)
            }
            console.error(error);
            throw new DatabaseConnectionError()
        }
    }
)

const checkAndUpdateCategories = async (categories) => {
    let categoryData = []

    await Promise.all(categories.map( async (category) => {
        try {
            const categoryExist = await Category.findOne({ name: category });
            if (categoryExist){
                categoryData.push({categoryId: categoryExist._id, name: categoryExist.name})
            }else{

                const res = new Category({name: category});
                await res.save();
                categoryData.push({categoryId: res._id, name: res.name})
            }
        } catch (error) {
            console.error(error);
            throw new DatabaseConnectionError()
        }
    })).catch((err) => {
        console.log(err)
        throw new DatabaseConnectionError()
    })

    return categoryData
}

module.exports = { blogRouter }
