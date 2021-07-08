import mongoose from "mongoose"

const { Schema, model } = mongoose

const reqString = {
  type: String,
  required: true,
}

const commentSchema = new Schema({
  authorName: reqString,
  comment: reqString,
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
})

const blogPostSchema = new Schema(
  {
    title: reqString,
    category: reqString,
    cover: String,
    authorId: reqString,
    content: reqString,
    readTime: reqString,
    comments: [commentSchema],
  },
  { timestamps: true }
)

const BlogPost = model("BlogPost", blogPostSchema)

export default BlogPost
