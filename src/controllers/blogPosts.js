import BlogPost from "../models/blogPosts.js"
import Author from "../models/author.js"

import createError from "http-errors"
import readingTime from "reading-time"
import striptags from "striptags"

// #############
// ### POSTS ###
// #############

// GET all blog posts
export const getAllPosts = async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find()
    res.json(blogPosts)
  } catch (error) {
    next(error)
  }
}

// GET single blog post
export const getSinglePost = async (req, res, next) => {
  try {
    res.send(res.locals.post)
  } catch (error) {
    next(error)
  }
}

// POST blog post
export const addNewPost = async (req, res, next) => {
  const { authorId } = req.body
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
    if (error.name === "CastError") next(createError(400, error.message))
    else next(error)
  }
}

// PUT blog post
export const editPost = async (req, res, next) => {
  const update = { ...req.body }
  // Updating read time if content was updated
  if (req.body.content) update.readTime = readingTime(striptags(req.body.content)).text
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.postId, update, { new: true, runValidators: true })
    res.json(updatedPost)
  } catch (error) {
    next(createError(400, error.message))
  }
}

// DELETE blog post
export const deletePost = async (req, res, next) => {
  try {
    await res.locals.post.remove()
    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// ################
// ### COMMENTS ###
// ################

// GET all comments by post ID
export const getPostComments = async (req, res, next) => {
  res.json(res.locals.post.comments)
}

// GET single comment on a post
export const getSingleComment = async (req, res, next) => {
  res.json(res.locals.comment)
}

// POST comment on a post
export const addNewComment = async (req, res, next) => {
  const newComment = req.body
  newComment.createdAt = new Date()
  newComment.updatedAt = new Date()

  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.postId,
      {
        $push: { comments: newComment },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    if (!updatedPost) return next(createError(404, `Post with id ${req.params.postId} not found`))
    res.json(updatedPost)
  } catch (error) {
    if (["ValidationError", "CastError"].includes(error.name)) next(createError(400, error.message))
    else next(error)
  }
}

// PUT comment on a post
export const updateComment = async (req, res, next) => {
  try {
    const oldComment = { ...res.locals.comment.toObject() }
    const updatedPost = await BlogPost.findOneAndUpdate(
      {
        _id: req.params.postId,
        "comments._id": req.params.commentId,
      },
      {
        $set: { "comments.$": { ...oldComment, ...req.body, updatedAt: new Date() } },
      },
      {
        new: true,
      }
    )
    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}

// DELETE comment on a post
export const deleteComment = async (req, res, next) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { comments: { _id: req.params.commentId } },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}

// #############
// ### COVER ###
// #############

// POST cover
export const uploadCover = async (req, res, next) => {
  res.locals.post.cover = req.file.path
  try {
    const updatedPost = await res.locals.post.save()

    res.json({ coverURL: updatedPost.cover })
  } catch (error) {
    next(error)
  }
}
