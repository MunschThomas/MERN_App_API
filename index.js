import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import helmet from "helmet"
import mongoose from "mongoose"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import User from "./models/User.js"
import Post from "./models/Post.js"
import { users, posts } from "./data/index.js"

/* CONFIG */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("dev"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/posts", postRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))

    /* ADD DATA ONE TIME */
    // User.insertMany(users)
    // Post.insertMany(posts)
  })
  .catch((err) => console.log(err))
