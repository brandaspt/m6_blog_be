import { checkSchema, validationResult } from "express-validator"
import createError from "http-errors"
import { filterObject } from "../../lib/utils.js"

export const authorKeys = ["name", "surname", "email", "dob"]

// Author body
const authorBodySchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "name must be of type string",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "surname must be of type string",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "email must be valid",
    },
  },
  dob: {
    in: ["body"],
    isString: {
      errorMessage: "dob(date of birth) must be of type string",
    },
  },
}

export const checkAuthorBodySchema = checkSchema(authorBodySchema)

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
