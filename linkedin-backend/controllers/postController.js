import { populate } from "dotenv";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Post from "../models/Post.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new post
export const createPost = catchAsyncError(async (req, res, next) => {
  let { content } = req.body;
  content = content?.trim();

  if (!content || content.length < 1 || content.length > 1000) {
    return next(
      new ErrorHandler(
        "Post content must be between 1 and 1000 characters",
        400
      )
    );
  }

  const post = await Post.create({
    content,
    author: req.user.id,
  });

  const populatedPost = await Post.findById(post._id).populate(
    "author",
    "name email avatar"
  );

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: populatedPost,
  });
});

//Get all posts
export const getAllPosts = catchAsyncError(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const lastCreatedAt = req.query.lastCreatedAt;

  const query = {};
  if (lastCreatedAt) {
    query.createdAt = { $lt: new Date(lastCreatedAt) };
  }

  const posts = await Post.find(query)
    .populate("author", "name avatar bio")
    .populate("likes", "name")
    .populate("comments.user", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    posts,
    hasMore: posts.length === limit,
  });
});

//Get user posts
export const getUserPosts = catchAsyncError(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  const lastCreatedAt = req.query.lastCreatedAt;

  const query = { author: req.params.userId };
  if (lastCreatedAt) {
    query.createdAt = { $lt: new Date(lastCreatedAt) };
  }

  const posts = await Post.find(query)
    .populate("author", "name avatar bio")
    .populate("likes", "name")
    .populate("comments.user", "name avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const postsWithCounts = posts.map((post) => ({
    ...post,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    isLikedByCurrentUser: req.user
      ? post.likes.some((like) => like._id.toString() === req.user.id)
      : false,
  }));
  res.status(200).json({
    success: true,
    posts: postsWithCounts,
  });
});

// Like/Unlike post
export const likePost = catchAsyncError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorHandler("Post not found", 404));

  const isLiked = post.likes.includes(req.user._id);

  if (isLiked) {
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  const updatedPost = await Post.findById(req.params.id)
    .populate("author", "name avatar bio")
    .populate("likes", "name")
    .populate("comments.user", "name avatar")
    .lean();

  const formatPost = (post) => ({
    ...post,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    isLikedByCurrentUser: post.likes.some(
      (like) => like._id.toString() === req.user.id
    ),
  });

  res.status(200).json({
    success: true,
    post: formatPost(updatedPost),
    message: isLiked ? "Post unliked" : "Post liked",
  });
});

// Add comment to post
export const addComment = catchAsyncError(async (req, res, next) => {
  const { comment } = req.body;
  if (!comment || comment.trim() === "") {
    return next(new ErrorHandler("Comment is required", 400));
  }

  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorHandler("Post not found", 404));

  const newComment = {
    user: req.user._id,
    comment: comment.trim(),
    createdAt: new Date(),
  };

  post.comments.push(newComment);
  await post.save();

  const updatedPost = await Post.findById(req.params.id)
    .populate("author", "name avatar bio")
    .populate("likes", "name")
    .populate("comments.user", "name avatar")
    .lean();

  const formatPost = (post) => ({
    ...post,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    isLikedByCurrentUser: post.likes.some(
      (like) => like._id.toString() === req.user.id
    ),
  });

  res.status(200).json({
    success: true,
    post: formatPost(updatedPost),
    message: "Comment added successfully",
  });
});
