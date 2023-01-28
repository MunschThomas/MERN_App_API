import express from "express"
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/postController.js"
import { upload } from "../middleware/multer.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.use(verifyToken)

router.get("/", getFeedPosts)
router.post("/", upload.single("picture"), createPost)
router.get("/:userId/posts", getUserPosts)
router.patch("/:id/like", likePost)

export default router
