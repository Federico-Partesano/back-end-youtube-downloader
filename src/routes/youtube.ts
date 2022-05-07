import express from "express";
import { youtubeController } from "../controllers/youtube";
import { auth } from "../middleware/out";
const router = express.Router();
const { convertMp3, getSongs, getSongss, addFavorite, getFavorites  } = youtubeController;


router.get("/songs", getSongs);
router.get("/", getSongss);
router.post("/addfavorite", auth, addFavorite);
router.get("/favorites", auth, getFavorites);

router.post("/:videoId", convertMp3);





export default router;
