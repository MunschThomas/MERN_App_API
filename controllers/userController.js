import User from "../models/User.js"

export const getUser = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const friends = await Promise.all(
      user.friends.map((friendId) =>
        User.findById(friendId).select("-password")
      )
    )
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        }
      }
    )
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(500).json(err)
  }
}

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params
    const user = await User.findById(id)
    const friend = await User.findById(friendId)

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((friend) => friend !== friendId)
      friend.friends = friend.friends.filter((friend) => friend !== id)
    } else {
      user.friends.push(friendId)
      friend.friends.push(id)
    }
    await user.save()
    await friend.save()

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        }
      }
    )
    res.status(200).json(formattedFriends)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}
