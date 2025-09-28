import express from "express";
import { signIn, signUp, logout } from "../controller/authController.js";

const router = express.Router();

router.post("/login", signIn);
router.post("/register", signUp);
router.get("/logout", logout);

export default router;
