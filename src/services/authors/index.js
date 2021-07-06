import express from "express"
import createError from "http-errors"

import { avatarsParser } from "../../settings/cloudinary.js"
import { getAuthor, updateDefaultAvatar } from "./middlewares.js"
import Author from "../../models/author.js"

const authorsRouter = express.Router()

// GET all authors
authorsRouter.get("/", async (req, res, next) => {
  try {
    const authorsArr = await Author.find()
    res.json(authorsArr)
  } catch (error) {
    next(error)
  }
})

// GET single author
authorsRouter.get("/:authorId", getAuthor, (req, res, next) => {
  res.json(res.locals.author)
})

// POST new author
authorsRouter.post("/", async (req, res, next) => {
  const author = { ...req.body }
  author.avatar = `https://ui-avatars.com/api/?name=${author.name}+${author.surname}`
  const newAuthor = new Author(author)
  try {
    await newAuthor.save()
    res.status(201).json(newAuthor)
  } catch (error) {
    next(createError(400, error.message))
  }
})

// UPDATE an author
authorsRouter.put("/:authorId", getAuthor, updateDefaultAvatar, async (req, res, next) => {
  const update = { ...req.body }
  if (res.locals.avatar) update.avatar = res.locals.avatar
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.authorId, update, { new: true })
    res.json(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

// DELETE an author
authorsRouter.delete("/:authorId", getAuthor, async (req, res, next) => {
  try {
    await res.locals.author.remove()
    res.json({ message: "Author deleted successfully" })
  } catch (error) {
    next(error)
  }
})

// POST avatar
authorsRouter.post("/:authorId/uploadAvatar", getAuthor, avatarsParser.single("authorAvatar"), async (req, res, next) => {
  const update = { avatar: req.file.path, modifiedAt: new Date() }
  try {
    // Updating author's avatar
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.authorId, update, { new: true })
    res.status(201).json(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

// Check Email
authorsRouter.post("/checkEmail", async (req, res, next) => {
  const email = req.body.email
  try {
    const results = await Author.find({ email: email }).exec()
    if (results.length) res.json(true)
    else res.json(false)
  } catch (error) {
    next(error)
  }
})

export default authorsRouter
