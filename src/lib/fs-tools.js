import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON } = fs

export const currentDirPath = filePath => dirname(fileURLToPath(filePath))

const dataFolderPath = join(currentDirPath(import.meta.url), "../data/")
const authorsJSONPath = join(dataFolderPath, "authors.json")
const postsJSONPath = join(dataFolderPath, "blogPosts.json")

// ### AUTHORS
export const getAuthorsArr = () => readJSON(authorsJSONPath)
export const writeAuthors = content => writeJSON(authorsJSONPath, content)

// ### BLOG POSTS
export const getPostsArr = () => readJSON(postsJSONPath)
export const writePosts = content => writeJSON(postsJSONPath, content)
