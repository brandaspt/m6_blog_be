import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mongoose from "mongoose"

import { corsOptions } from "./settings/cors.js"
import { badRequestMiddleware, catchErrorMiddleware, notFoundMiddleware } from "./errorMiddlewares.js"
import authorsRouter from "./services/authors/index.js"
import blogPostsRouter from "./services/blogPosts/index.js"

// Using Cloudinary
// const publicFolderPath = join(currentDirPath(import.meta.url), "../public")
const server = express()
const PORT = process.env.PORT
const DB_CONNECTION_URL = process.env.DATABASE_STRING

// Using Cloudinary
// server.use(express.static(publicFolderPath))
server.use(cors(corsOptions))
server.use(express.json())

// ### ENDPOINTS ###
server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)

// console.table(listEndpoints(server))

// ### ERROR MIDDLEWARES ###
server.use(badRequestMiddleware)
server.use(notFoundMiddleware)
server.use(catchErrorMiddleware)

// ### DATABASE ###
mongoose
  .connect(DB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() =>
    server.listen(PORT, () => {
      console.log("Server is running on port " + PORT)
    })
  )
  .catch(err => console.log(err.message))
