import express from "express";
import { work } from "../multer/work_multer.js";

import { addWork, deleteWork, getSingleWork, getWork } from "../controller/workController.js";

const workRouter = express.Router();


workRouter.post("", work.single("image"), addWork);
workRouter.get("", getWork);
workRouter.get("/:id", getSingleWork);
workRouter.delete("/:id", deleteWork);


export default workRouter;
