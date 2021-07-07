import createError from "http-errors"
import BlogPost from "../../models/blogPosts.js"

export const getPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.postId)
    if (post) {
      res.locals.post = post
      next()
    } else next(createError(404, `Post with id ${req.params.postId} not found`))
  } catch (error) {
    next(createError(404, `Post with id ${req.params.postId} not found`))
  }
}

export const getComment = async (req, res, next) => {
  try {
    const response = await BlogPost.findById(req.params.postId, {
      comments: { $elemMatch: { _id: req.params.commentId } },
    })
    if (!response) return next(createError(404, `Post with id ${req.params.postId} not found`))
    const { comments } = response
    if (!comments.length) return next(createError(404, `Comment with id ${req.params.commentId} not found`))
    res.locals.comment = comments[0]
    next()
  } catch (error) {
    if (error.name === "CastError") return next(createError(400, error.message))
    if (error.name === "MongoError") return next(createError(400, "Invalid comment ID"))
    next(error)
  }
}
