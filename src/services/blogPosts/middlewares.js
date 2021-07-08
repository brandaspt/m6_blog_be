import createError from "http-errors"
import BlogPost from "../../models/blogPosts.js"
import mongoose from "mongoose"

export const getPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.postId)
    if (post) {
      res.locals.post = post
      next()
    } else next(createError(404, `Post with id ${req.params.postId} not found`))
  } catch (error) {
    next(error)
  }
}

export const validateObjectId = async (req, res, next) => {
  if (req.params.postId) {
    if (!mongoose.isValidObjectId(req.params.postId)) return next(createError(400, "Invalid post ID"))
  }
  if (req.params.commentId) {
    if (!mongoose.isValidObjectId(req.params.commentId)) return next(createError(400, "Invalid comment ID"))
  }
  next()
}
