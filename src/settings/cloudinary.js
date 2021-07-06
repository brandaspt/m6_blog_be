import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"

const avatarsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Blog/Img/Avatars",
  },
})
export const avatarsParser = multer({ storage: avatarsStorage })

const coversStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Blog/Img/Covers",
  },
})
export const coversParser = multer({ storage: coversStorage })
