import createError from "http-errors"
import Author from "../../models/author.js"

export const getAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.authorId)
    if (author) {
      res.locals.author = author
      next()
    } else next(createError(404, `Author with id ${req.params.authorId} not found`))
  } catch (error) {
    next(error)
  }
}

export const updateDefaultAvatar = async (req, res, next) => {
  const author = res.locals.author
  let avatar = null
  if (author.avatar.includes("ui-avatars.com/api/")) {
    if (req.body.name && req.body.surname) {
      avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
    } else if (req.body.name) {
      avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${author.surname}`
    } else if (req.body.surname) {
      avatar = `https://ui-avatars.com/api/?name=${author.name}+${req.body.surname}`
    }
  }
  res.locals.avatar = avatar
  next()
}
