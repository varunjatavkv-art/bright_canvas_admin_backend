const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const db = require("./db");
const Post = require("./models/post");
const Work = require("./models/work");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"], // Add other methods you might need
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, "uploads/posts");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use("/uploads/posts", express.static(UPLOAD_DIR));

// Multer storage and file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const allowedMime = ["image/jpeg", "image/png"];
const allowedExt = [".jpg", ".jpeg", ".png"];

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMime.includes(file.mimetype) && allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg and .png files are allowed"));
  }
}

const upload = multer({ storage, fileFilter });

app.options("/api/blogs", cors());
app.post("/api/blogs", upload.single("image"), async (req, res) => {
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
});

app.get("/api/blogs", async (req, res) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const result = await Post.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// work directory
// Ensure uploads directory exists
const WORK_DIR = path.join(__dirname, "uploads/work");
if (!fs.existsSync(WORK_DIR)) fs.mkdirSync(WORK_DIR, { recursive: true });

app.use("/uploads/work", express.static(WORK_DIR));

// Multer storage and file filter
const work_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, WORK_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const allowedWorkMime = ["image/jpeg", "image/png"];
const allowedWorkExt = [".jpg", ".jpeg", ".png"];

function workFileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedWorkMime.includes(file.mimetype) && allowedWorkExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg and .png files are allowed"));
  }
}

const work = multer({ storage: work_storage, fileFilter: workFileFilter });

app.options("/api/work", cors());
app.post("/api/work", work.single("image"), async (req, res) => {
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
});

app.get("/api/work", async (req, res) => {
  try {
    const works = await Work.find().sort({ created_at: -1 });
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/work/:id", async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/api/work/:id", async (req, res) => {
  try {
    const result = await Work.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Work not found" });
    }
    res.status(200).json({ message: "Work deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const PORT = process.env.PORT || 8000;

// Start server after successful DB connection
db.connectWithRetry()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to DB, exiting", err);
    process.exit(1);
  });
