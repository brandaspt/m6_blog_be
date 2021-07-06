// 400 Bad request
export const badRequestMiddleware = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).json(err)
  } else {
    next(err)
  }
}

// 404 Not found
export const notFoundMiddleware = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).json(err)
  } else {
    next(err)
  }
}

// 500 Generic
export const catchErrorMiddleware = (err, req, res, next) => {
  console.log(err)
  res.status(500).send("Generic Server Error")
}
