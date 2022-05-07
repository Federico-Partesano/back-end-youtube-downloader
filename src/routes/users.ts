import express from "express";
import { usersController } from "../controllers/users";
const router = express.Router();
const {  signIn, signUp  } = usersController;


router.post("/signin", signIn);
router.post("/signup", signUp);




export default router;
