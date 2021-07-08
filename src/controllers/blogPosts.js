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
    const blogPosts = await BlogPost.find().populate("author")
    res.json(blogPosts)
  } catch (error) {
    next(error)
  }
}

// GET single blog post
export const getSinglePost = (req, res, next) => {
  res.json(res.locals.post)
}

// POST blog post
export const addNewPost = async (req, res, next) => {
  const blogPost = { ...req.body }

  try {
    const authorExists = await Author.exists({ _id: req.body.author })
    if (!authorExists) return next(createError(404, `Author with id ${req.body.author} not found`))
    // Adding read time
    blogPost.readTime = readingTime(striptags(req.body.content)).text
    const newBlogPost = new BlogPost(blogPost)
    await newBlogPost.save()
    res.status(201).json(newBlogPost)
  } catch (error) {
    if (error.name === "ValidationError") next(createError(400, error.message))
    else next(error)
  }
}

// PUT blog post
export const editPost = async (req, res, next) => {
  const update = { ...req.body }
  // Updating read time if content was updated
  if (req.body.content) update.readTime = readingTime(striptags(req.body.content)).text
  try {
    const authorExists = await Author.exists({ _id: req.body.author })
    if (!authorExists) return next(createError(404, `Author with id ${req.body.author} not found`))
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.postId, update, { new: true, runValidators: true })
    if (!updatedPost) return next(createError(404, `Post with id ${req.params.postId} not found`))
    res.json(updatedPost)
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") next(createError(400, error.message))
    else next(error)
  }
}

// DELETE blog post
export const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await BlogPost.findByIdAndDelete(req.params.postId)
    if (!deletedPost) return next(createError(404, `Post with id ${req.params.postId} not found`))
    res.json(deletedPost)
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
  try {
    const response = await BlogPost.findById(req.params.postId, {
      comments: { $elemMatch: { _id: req.params.commentId } },
    })
    if (!response) return next(createError(404, `Post with id ${req.params.postId} not found`))
    const { comments } = response
    if (!comments.length) return next(createError(404, `Comment with id ${req.params.commentId} not found`))
    res.json(comments)
  } catch (error) {
    next(error)
  }
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
    res.status(201).json(updatedPost)
  } catch (error) {
    if (error.name === "ValidationError") next(createError(400, error.message))
    else next(error)
  }
}

// PUT comment on a post
export const updateComment = async (req, res, next) => {
  const post = res.locals.post
  const index = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
  if (index === -1) return next(createError(404, `Comment with id ${req.params.commentId} not found`))
  post.comments[index] = { ...post.comments[index].toObject(), ...req.body, updatedAt: new Date() }
  try {
    // const updatedPost = await BlogPost.findOneAndUpdate(
    //   {
    //     _id: req.params.postId,
    //     "comments._id": req.params.commentId,
    //   },
    //   {
    //     $set: { "comments.$": { ...oldComment, ...req.body, updatedAt: new Date() } },
    //   },
    //   {
    //     new: true,
    //   }
    // )
    await post.save()
    res.json(post)
  } catch (error) {
    if (error.name === "ValidationError") next(createError(400, error.message))
    else next(error)
  }
}

// DELETE comment on a post
export const deleteComment = async (req, res, next) => {
  const post = res.locals.post
  const index = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
  if (index === -1) return next(createError(404, `Comment with id ${req.params.commentId} not found`))
  post.comments.splice(post.comments[index], 1)
  try {
    // const updatedPost = await BlogPost.findByIdAndUpdate(
    //   req.params.postId,
    //   {
    //     $pull: { comments: { _id: req.params.commentId } },
    //   },
    //   {
    //     new: true,
    //     runValidators: true,
    //   }
    // )
    await post.save()
    res.json(post)
  } catch (error) {
    next(error)
  }
}

// #############
// ### COVER ###
// #############

// POST cover
export const uploadCover = async (req, res, next) => {
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(req.params.postId, { cover: req.file.path }, { new: true })
    if (!updatedPost) return next(createError(404, `Post with id ${req.params.postId} not found`))
    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}
