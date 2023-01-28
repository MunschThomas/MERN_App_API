import express from "express"
import { login, register } from "../controllers/auth.controller.js"
import { upload } from "../middleware/multer.js"

const router = express.Router()

router.post("/register", upload.single("picture"), register)
router.post("/login", login)

export default router
