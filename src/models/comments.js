import mongoose from "mongoose"

const commentSchema = mongoose.Schema(
  {
    authorName: { type: String, required: true },
    comment: { type: String, required: true },
    postId: { type: String, required: true },
  },
  { timestamps: true }
)

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
