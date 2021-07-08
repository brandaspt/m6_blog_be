import express from "express"

import { avatarsParser } from "../../settings/cloudinary.js"
import { getAuthor, updateDefaultAvatar } from "./middlewares.js"
import {
  addNewAuthor,
  checkEmail,
  deleteAuthor,
  editAuthor,
  getAllAuthors,
  getSingleAuthor,
  uploadAvatar,
} from "../../controllers/authors.js"
import { validateObjectId } from "../sharedMiddlewares.js"

const authorsRouter = express.Router()

// GET all authors
authorsRouter.get("/", getAllAuthors)

// GET single author
authorsRouter.get("/:authorId", validateObjectId, getAuthor, getSingleAuthor)

// POST new author
authorsRouter.post("/", addNewAuthor)

// UPDATE an author
authorsRouter.put("/:authorId", validateObjectId, getAuthor, updateDefaultAvatar, editAuthor)

// DELETE an author
authorsRouter.delete("/:authorId", validateObjectId, deleteAuthor)

// POST avatar
authorsRouter.post("/:authorId/uploadAvatar", validateObjectId, getAuthor, avatarsParser.single("authorAvatar"), uploadAvatar)

// Check Email
authorsRouter.post("/checkEmail", checkEmail)

export default authorsRouter
