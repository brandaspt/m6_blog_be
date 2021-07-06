import express from "express"
import readingTime from "reading-time"
import mongoose from "mongoose"
import createError from "http-errors"
import striptags from "striptags"

import { coversParser } from "../../settings/cloudinary.js"
import { getPost } from "./middlewares.js"

import BlogPost from "../../models/blogPosts.js"
import Author from "../../models/author.js"
import Comment from "../../models/comments.js"

const blogPostsRouter = express.Router()

// GET all blog posts
blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find()
    res.json(blogPosts)
  } catch (error) {
    next(error)
  }
})

// GET single blog post
blogPostsRouter.get("/:postId", getPost, async (req, res, next) => {
  try {
    res.send(res.locals.post)
  } catch (error) {
    next(error)
  }
})

// POST blog post
blogPostsRouter.post("/", async (req, res, next) => {
  const { authorId } = req.body
  if (!mongoose.Types.ObjectId.isValid(authorId)) return next(createError(400, `${authorId} is not a valid id`))

  const blogPost = { ...req.body }
  // Adding read time
  blogPost.readTime = readingTime(striptags(req.body.content)).text

  try {
    const author = await Author.findById(authorId)
    if (!author) return next(createError(404, `Author with id ${authorId} not found`))
    const newBlogPost = new BlogPost(blogPost)
    await newBlogPost.save()
    res.status(201).json(newBlogPost)
  } catch (error) {
    next(createError(400, error.message))
  }
})

// PUT blog post
blogPostsRouter.put("/:postId", getPost, async (req, res, next) => {
  const update = { ...req.body }
  // Updating read time if content was updated
  if (req.body.content) update.readTime = readingTime(striptags(req.body.content)).text
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.postId, update, { new: true })
    res.json(updatedPost)
  } catch (error) {
    next(createError(400, error.message))
  }
})

// DELETE blog post
blogPostsRouter.delete("/:postId", getPost, async (req, res, next) => {
  try {
    await res.locals.post.remove()
    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    next(error)
  }
})

// POST comment
blogPostsRouter.post("/:postId/comments", getPost, async (req, res, next) => {
  const newComment = req.body
  newComment.postId = res.locals.post._id
  try {
    const createdComment = await new Comment(newComment)
    await createdComment.save()
    res.status(201).send(createdComment)
  } catch (error) {
    if (error.name === "ValidationError") next(createError(400, error.errors))
    else next(error)
  }
})

// GET all comments by post ID
blogPostsRouter.get("/:postId/comments", getPost, async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: res.locals.post._id })
    res.json(comments)
  } catch (error) {
    next(error)
  }
})

// POST cover
blogPostsRouter.post("/:postId/uploadCover", getPost, coversParser.single("postCover"), async (req, res, next) => {
  res.locals.post.cover = req.file.path
  try {
    const updatedPost = await res.locals.post.save()

    res.json({ coverURL: updatedPost.cover })
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter
