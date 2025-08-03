import express from 'express';
import { registerUser, loginUser, logoutUser, getUserDetails, getUserProfile} from '../controllers/userController.js';
import singleUpload from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post("/register", singleUpload, registerUser);
router.post("/login", loginUser);
router.get('/logout', logoutUser)
router.get('/get-details', isAuthenticated, getUserDetails)
router.get('/get-profile/:id', isAuthenticated, getUserProfile)

export default router;