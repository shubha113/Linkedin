import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/User.js";
import sendToken from "../utils/sendToken.js";
import Post from "../models/Post.js";

//Register User
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, bio } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  //Handle Avatar upload
  const file = req.file;
  const fileUri = getDataUri(file);
  const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }
  user = await User.create({
    name,
    email,
    password,
    bio: bio || "",
    avatar: cloudResponse.secure_url,
  });

  res.status(200).json({
    success: true,
    message: "User registered successfully",
  });
});

//Login controller
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  
  //sending token
  sendToken(user, res, 201, "Log in successful");
});

// Logout User
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

//Get user details
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new ErrorHandler("Unauthorized: No user found in the request.", 401));
  }

  const user = await User.findById(req.user.id).select(
    "name email bio avatar createdAt"
  );

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//Get user details by id
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "name email bio avatar createdAt"
  );
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const posts = await Post.find({ author: req.params.id })
    .populate("author", "name email avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: { user, posts },
  });
});

