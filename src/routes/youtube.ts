import express from "express";
import { youtubeController } from "../controllers/youtube";
const router = express.Router();
const { convertMp3, getSongs  } = youtubeController;


router.get("/songs", getSongs);
router.post("/:videoId", convertMp3);




export default router;
