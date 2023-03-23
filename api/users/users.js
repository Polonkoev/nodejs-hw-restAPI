const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const { auth } = require("../../middlewares/auth");
const { getUserById, updateUserToken } = require("../utils");
const gravatar = require("gravatar");
const upload = require("../../middlewares/upload");

const Jimp = require("jimp");

require("dotenv").config();

const secret = process.env.SECRET;

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res
      .json({
        status: "error",
        code: 400,
        message: "Incorrect login or password",
        data: "Bad request",
      })
      .status(400);
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  await updateUserToken(user.id, token);

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      avatar: user.avatarURL,
    },
  });
});

router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const avatarURl = gravatar
    .url(email, { s: "200", r: "pg", d: "404" })
    .slice(2);
  if (user) {
    return res
      .json({
        status: "error",
        code: 409,
        message: "Email is already in use",
        data: "Conflict",
      })
      .status(409);
  }
  try {
    const newUser = new User({ email });
    newUser.setAvatar(avatarURl);

    newUser.setPassword(password);
    await newUser.save();
    res
      .json({
        status: "success",
        code: 201,
        data: {
          message: "Registration successful",
        },
      })
      .status(201);
  } catch (error) {
    next(error);
  }
});

router.get("/logout", auth, async (req, res, next) => {
  const { _id: userId } = req.user;

  await updateUserToken(userId, "");
  res.json({
    status: "success",
    code: 204,
    data: {
      message: `No Content`,
    },
  });
});

router.get("/current", auth, async (req, res, next) => {
  const { _id: userId } = req.user;

  const { email, subscription, avatarURL } = await getUserById(userId);
  console.log(avatarURL);

  res.json({
    status: "success",
    code: 204,
    data: {
      message: {
        email,
        subscription,
        avatar: avatarURL,
      },
    },
  });
});

router.get("/users/verify/:verificationToken", async (req, res) => {});

router.patch("/avatars", auth, upload.single("avatar"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const image = await Jimp.read(imagePath);
    image.resize(256, 256).quality(60);
    const newFileName = "avatar-" + `${req.user.email}-` + Date.now() + ".jpg";
    const newImagePath = "public/avatars/" + newFileName;
    await image.writeAsync(newImagePath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatarURL: newImagePath } },
      { new: true }
    );

    res.status(200).json({
      Status: 200,
      avatarURL: updatedUser.avatarURL,
      message: "Avatar has been updated ",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
