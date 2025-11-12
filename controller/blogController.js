import path from "path";
import { fileURLToPath } from "url";
import { Post } from "../models/post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addBlogs = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }
    if (!req.file && !req.file.path) {
      return res
        .status(400)
        .json({ error: "image is required and must be jpg/jpeg/png" });
    }
    const imagePath = path.relative(__dirname, req.file.path);
    const createdAt = new Date();

    const doc = await Post.create({
      title,
      description: description || "",
      image_path: imagePath,
      created_at: createdAt,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    const posts = await Post.find().skip(skip).limit(limit);
    const totalCounts = await Post.countDocuments();
    res.json({
      totalCounts: parseInt(totalCounts),
      data: posts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
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