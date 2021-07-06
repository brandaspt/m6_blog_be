import mongoose from "mongoose"

const blogPostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    cover: String,
    authorId: { type: String, required: true },
    content: { type: String, required: true },
    comments: { type: Array, default: [] },
    readTime: { type: String, required: true },
  },
  { timestamps: true }
)

const BlogPost = mongoose.model("BlogPost", blogPostSchema)

export default BlogPost
