import express from "express";
import { upload } from "../multer/blog_multer.js";
import { addBlogs, deleteBlog, getBlogs, getSingleBlog } from "../controller/blogController.js";
import { multer_error } from "../multer/multer_error.js";
const blogRouter = express.Router();

blogRouter.post("", upload.single("image"), addBlogs, multer_error);
blogRouter.get("", getBlogs)
blogRouter.get("/:id", getSingleBlog);
blogRouter.delete("/:id", deleteBlog);


export default blogRouter;