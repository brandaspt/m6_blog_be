import mongoose from "mongoose"
import isEmail from "validator/lib/isEmail.js"

const authorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    avatar: String,
    dob: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
      required: true,
    },
  },
  { timestamps: true }
)

const Author = mongoose.model("Author", authorSchema)

export default Author
