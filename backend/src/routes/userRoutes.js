import express from "express";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/userController.js";
import { protectedRoute } from "../middleware/auth.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

export default router;
