import express from "express"

import { coversParser } from "../../settings/cloudinary.js"
import { getComment, getPost } from "./middlewares.js"

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
blogPostsRouter.get("/:postId", getPost, getSinglePost)

// POST blog post
blogPostsRouter.post("/", addNewPost)

// PUT blog post
blogPostsRouter.put("/:postId", getPost, editPost)

// DELETE blog post
blogPostsRouter.delete("/:postId", getPost, deletePost)

// ################
// ### COMMENTS ###
// ################

// GET all comments by post ID
blogPostsRouter.get("/:postId/comments", getPost, getPostComments)

// GET single comment on a post
blogPostsRouter.get("/:postId/comments/:commentId", getComment, getSingleComment)

// POST comment on a post
blogPostsRouter.post("/:postId/comments", addNewComment)

// PUT comment on a post
blogPostsRouter.put("/:postId/comments/:commentId", getComment, updateComment)

// DELETE comment on a post
blogPostsRouter.delete("/:postId/comments/:commentId", getComment, deleteComment)

// #############
// ### COVER ###
// #############

// POST cover
blogPostsRouter.post("/:postId/uploadCover", getPost, coversParser.single("postCover"), uploadCover)

export default blogPostsRouter
