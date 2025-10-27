import path from "path";
import { Work } from "../models/work.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const addWork = async (req, res) => {
  try {
    const { title, description, service } = req.body;
    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "image is required and must be jpg/jpeg/png" });
    }

    const imagePath = path.relative(__dirname, req.file.path);
    const createdAt = new Date();

    const doc = await Work.create({
      title,
      description: description || "",
      service: service || "",
      image_path: imagePath,
      created_at: createdAt,
    });

    res.status(201).json(doc);
  } catch (err) {
    console.log("error: ", err);
    res.status(400).json({ error: err.message });
  }
};

export const getWork = async (req, res) => {
  try {
    const works = await Work.find().sort({ created_at: -1 });
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSingleWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteWork = async (req, res) => {
    try {
      const result = await Work.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Work not found" });
      }
      res.status(200).json({ message: "Work deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
