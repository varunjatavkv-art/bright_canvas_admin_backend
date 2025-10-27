import express from "express";
import { upload } from "../multer/blog_multer.js";
import { addBlogs, deleteBlog, getBlogs, getSingleBlog } from "../controller/blogController.js";
const blogRouter = express.Router();

blogRouter.post("", upload.single("image"), addBlogs);
blogRouter.get("", getBlogs)
blogRouter.get("/:id", getSingleBlog);
blogRouter.delete("/:id", deleteBlog);


export default blogRouter;