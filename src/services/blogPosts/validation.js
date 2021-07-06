import { checkSchema, validationResult, body } from "express-validator"
import createError from "http-errors"
import { filterObject } from "../../lib/utils.js"

export const commentsKeys = ["authorName", "comment"]
export const postKeys = ["title", "category", "cover", "authorId", "content"]

// Posts body
const postBodySchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "title must be of type string",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category must be of type string",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "cover must be of type string",
    },
  },
  authorId: {
    in: ["body"],
    isString: {
      errorMessage: "authorId must be of type string",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "content must be of type string",
    },
  },
}

export const checkPostBodySchema = checkSchema(postBodySchema)

// Comments body
export const commentBodyValidation = [
  body("authorName").exists().withMessage("authorName is required").isString().withMessage("authorName must be of type string"),
  body("comment").exists().withMessage("comment is required").isString().withMessage("comment must be of type string"),
]

export const filterRequest = ({ field, keys }) => {
  return (req, res, next) => {
    req[field] = filterObject(req[field], keys)
    next()
  }
}

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(createError(400, errors))
  } else {
    next()
  }
}
