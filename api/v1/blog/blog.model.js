const mongoose = require('mongoose');
const createDomPurifier = require('dompurify')
const { JSDOM } = require('jsdom')
const { marked } = require('marked');
const { markedHighlight } = require('marked-highlight')
const markdown_it = require('markdown-it')
const hljs = require('highlight.js')
const dompurify = createDomPurifier(new JSDOM().window)

const md_it = new markdown_it()
// marked.use({
//   langPrefix: false,
//   mangle: false,
//   headerIds: false
// });

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  sanitizedBodyHtml: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  likeCount: {
    type: Number,
    default: 0
  },
  dislikeCount: {
    type: Number,
    default: 0
  },
  categories: [{
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    name: {
        type: String,
        required: true
    }
  }],
  tags: {
    type: [String],
    default: []
  }
});

BlogSchema.pre('validate', function(next){
    if (this.body) {
        this.sanitizedBodyHtml = dompurify.sanitize(
          this.body
        )
    }
    next()
})

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
