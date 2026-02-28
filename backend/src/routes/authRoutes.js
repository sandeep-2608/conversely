import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
} from "../controllers/authController.js";
import { protectedRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding", protectedRoute, onboard);

router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
