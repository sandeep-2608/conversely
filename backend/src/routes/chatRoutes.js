import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import { getStreamToken } from "../controllers/chatController.js";

const router = express.Router();

router.get("/token", protectedRoute, getStreamToken);

export default router;
