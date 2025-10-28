import express from "express";
import { work } from "../multer/work_multer.js";

import { addWork, deleteWork, getSingleWork, getWork } from "../controller/workController.js";
import { multer_error } from "../multer/multer_error.js";

const workRouter = express.Router();


workRouter.post("", work.single("image"), addWork , multer_error);
workRouter.get("", getWork);
workRouter.get("/:id", getSingleWork);
workRouter.delete("/:id", deleteWork);


export default workRouter;
