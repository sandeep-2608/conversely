import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format. Please enter a valid email." });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generate a random number between 1 and 100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      password,
      name,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.name,
        image: newUser.profilePic || "",
      });
      console.log(`User ${newUser.name} created in Stream`);
    } catch (error) {
      console.log("Error creating Stream user", error);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks
      sameSite: "strict", // prevent CSRF attacks
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!name || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !name && "name",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // update stream user
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        image: updatedUser.profilePic || "",
      });

      console.log(`User ${updatedUser.name} updated in Stream`);
    } catch (error) {
      console.log("Error updating Stream user", error.message);
    }

    res.status(200).json({
      success: true,
      message: "User onboarded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in onboard controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
