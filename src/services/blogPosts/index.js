import express from "express"

import { coversParser } from "../../settings/cloudinary.js"
import { getPost } from "./middlewares.js"
import { validateObjectId } from "../sharedMiddlewares.js"

import {
  addNewComment,
  addNewPost,
  deleteComment,
  deletePost,
  editPost,
  getAllPosts,
  getPostComments,
  getSingleComment,
  getSinglePost,
  updateComment,
  uploadCover,
} from "../../controllers/blogPosts.js"

const blogPostsRouter = express.Router()

// #############
// ### POSTS ###
// #############

// GET all blog posts
blogPostsRouter.get("/", getAllPosts)

// GET single blog post
blogPostsRouter.get("/:postId", validateObjectId, getPost, getSinglePost)

// POST blog post
blogPostsRouter.post("/", addNewPost)

// PUT blog post
blogPostsRouter.put("/:postId", validateObjectId, editPost)

// DELETE blog post
blogPostsRouter.delete("/:postId", validateObjectId, deletePost)

// ################
// ### COMMENTS ###
// ################

// GET all comments by post ID
blogPostsRouter.get("/:postId/comments", validateObjectId, getPost, getPostComments)

// GET single comment on a post
blogPostsRouter.get("/:postId/comments/:commentId", validateObjectId, getSingleComment)

// POST comment on a post
blogPostsRouter.post("/:postId/comments", validateObjectId, addNewComment)

// PUT comment on a post
blogPostsRouter.put("/:postId/comments/:commentId", validateObjectId, getPost, updateComment)

// DELETE comment on a post
blogPostsRouter.delete("/:postId/comments/:commentId", validateObjectId, getPost, deleteComment)

// #############
// ### COVER ###
// #############

// POST cover
blogPostsRouter.post("/:postId/uploadCover", validateObjectId, getPost, coversParser.single("postCover"), uploadCover)

export default blogPostsRouter
