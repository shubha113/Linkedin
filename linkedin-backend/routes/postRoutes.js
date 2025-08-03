import express from "express";
import {
  addComment,
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
} from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createPost);
router.get("/posts", isAuthenticated, getAllPosts);
router.get("/user-posts/:userId", isAuthenticated, getUserPosts);
router.put("/:id/like", isAuthenticated, likePost);
router.post("/:id/comment", isAuthenticated, addComment);

export default router;
