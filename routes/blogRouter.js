import express from "express";
import { upload } from "../multer/blog_multer.js";
import { addBlogs, deleteBlog, getBlogs, getSingleBlog, updateBlog } from "../controller/blogController.js";
import { multer_error } from "../multer/multer_error.js";
import { verifyN8nSecret } from "../middleware/verifyN8NSecret.js";
const blogRouter = express.Router();

blogRouter.post("", verifyN8nSecret, addBlogs);
blogRouter.get("", getBlogs)
blogRouter.get("/:id", getSingleBlog);
blogRouter.delete("/:id", deleteBlog);
blogRouter.put("/update/:id", upload.single("image"), updateBlog);

export default blogRouter;