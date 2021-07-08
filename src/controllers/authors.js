import createError from "http-errors"

import Author from "../models/author.js"

// ### GET all authors ###
export const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find()
    res.json(authors)
  } catch (error) {
    next(error)
  }
}

// ### GET single author ###
export const getSingleAuthor = (req, res, next) => {
  res.json(res.locals.author)
}

// ### POST new author ###
export const addNewAuthor = async (req, res, next) => {
  const author = { ...req.body }
  author.avatar = `https://ui-avatars.com/api/?name=${author.name}+${author.surname}`
  const newAuthor = new Author(author)
  try {
    await newAuthor.save()
    res.status(201).json(newAuthor)
  } catch (error) {
    if (error.name === "ValidationError") next(createError(400, error.message))
    else next(error)
  }
}

// ### PUT author ###
export const editAuthor = async (req, res, next) => {
  const update = { ...req.body }
  if (res.locals.avatar) update.avatar = res.locals.avatar

  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.authorId, update, { new: true, runValidators: true })
    res.json(updatedAuthor)
  } catch (error) {
    if (error.name === "ValidationError") next(createError(400, error.message))
    else next(error)
  }
}

// ### DELETE author ###
export const deleteAuthor = async (req, res, next) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.authorId)
    if (!deletedAuthor) return next(createError(404, `Author with id ${req.params.authorId} not found`))
    res.json(deletedAuthor)
  } catch (error) {
    next(error)
  }
}

// ### POST author avatar ###
export const uploadAvatar = async (req, res, next) => {
  const author = res.locals.author
  author.avatar = req.file.path
  try {
    // Updating author's avatar
    await author.save()
    res.json(author)
  } catch (error) {
    next(error)
  }
}

// ### GET check email ###
export const checkEmail = async (req, res, next) => {
  const email = req.body.email
  try {
    const exists = await Author.exists({ email: email })
    exists ? res.json(true) : res.json(false)
  } catch (error) {
    next(error)
  }
}
