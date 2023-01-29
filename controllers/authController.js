import argon2 from "argon2"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body

    const hashingOptions = {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    }
    const hashedPassword = await argon2.hash(password, hashingOptions)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/* LOGIN USER */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()
    if (!user) return res.status(404).json({ error: "User not found" })

    const isMatch = await argon2.verify(user.password, password)
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    delete user.password
    res.status(200).json({ token, user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
