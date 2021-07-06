import express from "express"
import uniqid from "uniqid"
import readingTime from "reading-time"
import mongoose from "mongoose"
import createError from "http-errors"
import striptags from "striptags"

import { coversParser } from "../../settings/cloudinary.js"

import { commentBodyValidation, checkValidationResult, filterRequest, commentsKeys } from "./validation.js"
import { getPost } from "./middlewares.js"
import { getPostsArr, writePosts, getAuthorsArr } from "../../lib/fs-tools.js"

import BlogPost from "../../models/blogPosts.js"
import Author from "../../models/author.js"

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
    res.send(res.locals.requiredPost)
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
blogPostsRouter.post(
  "/:postId/comments",
  getPost,
  commentBodyValidation,
  checkValidationResult,
  filterRequest({ field: "body", keys: commentsKeys }),
  async (req, res, next) => {
    try {
      const postsArr = await getPostsArr()
      const newComment = { ...req.body, _id: uniqid(), createdAt: new Date() }
      postsArr[res.locals.requiredPostIndex].comments.push(newComment)

      await writePosts(postsArr)

      res.status(201).send(newComment)
    } catch (error) {
      next(err)
    }
  }
)

// GET all comments
blogPostsRouter.get("/:postId/comments", getPost, async (req, res, next) => {
  try {
    res.send(res.locals.requiredPost.comments)
  } catch (error) {
    next(error)
  }
})

// POST cover
blogPostsRouter.post("/:postId/uploadCover", getPost, coversParser.single("postCover"), async (req, res, next) => {
  try {
    const postsArr = await getPostsArr()
    const postIndex = res.locals.requiredPostIndex

    // Updating posts array
    const updatedPost = { ...postsArr[postIndex], updatedAt: new Date() }
    updatedPost.cover = req.file.path
    postsArr[postIndex] = updatedPost
    await writePosts(postsArr)

    res.status(201).send(updatedPost)
  } catch (error) {
    next(error)
  }
})

export default blogPostsRouter
