import mongoose from "mongoose"
import createError from "http-errors"

export const validateObjectId = async (req, res, next) => {
  if (req.params.postId) {
    if (!mongoose.isValidObjectId(req.params.postId)) return next(createError(400, "Invalid post ID"))
  }
  if (req.params.commentId) {
    if (!mongoose.isValidObjectId(req.params.commentId)) return next(createError(400, "Invalid comment ID"))
  }
  if (req.params.authorId) {
    if (!mongoose.isValidObjectId(req.params.authorId)) return next(createError(400, "Invalid author ID"))
  }
  next()
}
