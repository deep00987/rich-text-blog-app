const express = require("express");
const bodyparser = require("body-parser");
const cookieSession = require("cookie-session");
const path = require("path")
const app = express();
const cors = require('cors');
require('dotenv').config()
require('express-async-errors');
const { errHandler } = require('./middlewares/error-handlers')
const {NotFoundErr} = require('./error-types/not-found-err')

const { authRouter } = require('./api/v1/auth/user.auth.routes')
const { categoryRouter } = require('./api/v1/category/category.routes')
const { blogRouter } = require("./api/v1/blog/blog.routes")
const { commentRouter } = require('./api/v1/comment/comment.routes')
const { replyRouter } = require('./api/v1/comment/reply.routes');


const uploads = path.join(__dirname, "uploads" )
console.log(uploads)

app.set('trust proxy', true);
app.use(cors({
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
  credentials: true,
  origin: [
    "http://localhost:5173", 
    "http://192.168.0.188:5173",  
    "https://blog-site-deep00987.netlify.app", 
    "https://celebalt1-production.up.railway.app", 
    "http://localhost:3000", 
    "http://192.168.0.188:3000"
  ]
}));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? 'none' : false
  })
);

app.use("/uploads", express.static(__dirname + '/uploads/'))

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))


//==================================== api routes ==================================
app.use('/api/auth', authRouter);
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/comment', commentRouter)
app.use('/api/reply', replyRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundErr();
})

app.use(errHandler);

module.exports =  { app };
