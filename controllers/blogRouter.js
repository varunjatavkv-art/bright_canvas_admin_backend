import express from "express";
import path, { dirname } from "path"; // Combine path and dirname imports
import { fileURLToPath } from "url";  // Helper for __dirname
import Post from "../models/post.js";
import { upload } from "../multer.js";

// --- FIX: Define __dirname for ES Module scope ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// -------------------------------------------------

const router = express.Router();

// post blog
router.post("/api/blogs", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }
    // Corrected check: if req.file is present, req.file.path will exist.
    if (!req.file) {
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
});

// get all blogs
router.get("/api/blogs", async (req, res) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get single blog by id
router.get("/api/blogs/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete single blog
router.delete("/api/blogs/:id", async (req, res) => { // Corrected: Added missing '/'
  try {
    // Corrected Mongoose syntax to find and delete by ID
    const result = await Post.deleteOne({ _id: req.params.id }); 
    if (result.deletedCount === 0) { // Check if a document was actually deleted
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;