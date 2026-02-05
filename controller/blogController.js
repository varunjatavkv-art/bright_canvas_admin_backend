import path from "path";
import { fileURLToPath } from "url";
import { Blog } from "../models/blog.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addBlogs = async (req, res) => { 
  try { 
    const { title, content, imageUrl, tags } = req.body; 
 
    // Basic validation (Zod/Joi recommended) 
    if (!title || !content) { 
      return res.status(400).json({ error: 'Missing required fields' }); 
    } 
 
    const newPost = new Blog({ 
      title, 
      content, 
      imageUrl, 
      tags, 
      status: 'draft' // Explicit safeguard 
    }); 
 
    const savedPost = await newPost.save(); 
 
    console.log(`[Content] New draft ingested: ${savedPost._id}`); 
 
    res.status(201).json({ 
      success: true, 
      id: savedPost._id 
    }); 
 
  } catch (error) { 
    console.error('Webhook Error:', error); 
    res.status(500).json({ error: 'Internal Server Error' }); 
  } 
};

export const getBlogs = async (req, res) => {
  try {
    // take page no and limit from req query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // set skip to skip the data on every page change
    const skip = (page - 1) * limit;

    
    // fetch data from datamodel using skip and limit
    const blogs = await Blog.find().skip(skip).limit(limit);
    const totalCounts = await Blog.countDocuments();
    res.json({
      totalCounts: parseInt(totalCounts),
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlog = async(req,res) => {
  try {
    const {title, description} = req.body;
    // console.log(title, description);
    const id = req.params.id;

    
    const updatedAt = new Date();
    if (!req.file && !req.file.path) {
      return res
        .status(400)
        .json({ error: "image is required and must be jpg/jpeg/png" });
    }
    const imagePath = path.relative(__dirname, req.file.path);
  
    
    const result = await Post.updateOne(
      {_id: id},
      {
        $set: {
          title: title,
          description: description,
          image_path: imagePath,
          updated_at: updatedAt
        }
      }
    );

    res.status(200).json({result, message: "Blog Updated Succesfully!!"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}