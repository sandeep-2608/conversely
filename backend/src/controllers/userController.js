import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendUsers);
  } catch (error) {
    console.log("Error getting recommended users", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", "name profilePic nativeLanguage learningLanguage"); // populate friends field with name, nativeLanguage, learningLanguage and profilePic fields
    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error getting friends", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: recipientId } = req.params;

    // Prevent sending friend request to yourself
    if (myId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    // check if a friend request has already been sent
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ success: false, message: "Friend request already exists" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error sending friend request", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found" });
    }

    // Verify that current user is recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to accept this friend request",
      });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to each other's friends list
    await User.findByIdAndUpdate(
      friendRequest.sender,
      { $addToSet: { friends: friendRequest.recipient } },
      { new: true },
    );

    await User.findByIdAndUpdate(
      friendRequest.recipient,
      { $addToSet: { friends: friendRequest.sender } },
      { new: true },
    );

    res.status(200).json({ success: true, message: "Friend request accepted" });
  } catch (error) {
    console.log("Error accepting friend request", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "name profilePic nativeLanguage learningLanguage");

    const acceptedRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "accepted",
    }).populate("recipient", "name profilePic");

    res.status(200).json({
      incomingRequests,
      acceptedRequests,
    });
  } catch (error) {
    console.log("Error getting friend requests", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getOutgoingFriendRequests = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", "name profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error getting outgoing friend requests", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
