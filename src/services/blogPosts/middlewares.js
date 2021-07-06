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
