import mongoose from "mongoose"

const reqString = {
  type: String,
  required: true,
}

const commentSchema = mongoose.Schema({
  authorName: reqString,
  comment: reqString,
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
})

const blogPostSchema = mongoose.Schema(
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

const BlogPost = mongoose.model("BlogPost", blogPostSchema)

export default BlogPost
