const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { createError } = require("../middlewares/customError");
const {asyncWrapper} = require("../middlewares/asyncwrapper");

const register = asyncWrapper(async (req, res, next) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    next(createError("Input field cannot be empty", 400));
  }

  let user = await User.findOne({ email , username})
  if (user) {
    next(createError("email already in use", 400));
  }
  user = await User.findOne({ username});
  if (user) {
    next(createError("username already in use", 400));
  }

  const hashpassword = await bcrypt.hash(password, 10);

  user = await User.create({ email, username, password: hashpassword });

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "registration sucessfull",
    data: { ...user._doc, password: undefined },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(createError("provide correct details", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    next(createError("provide correct details", 400));
  }

  const verifyPassword = await bcrypt.compare(password, user.password);
  if (verifyPassword) {
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // for dev mode
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      saveUnititialized: true,
      resave: false,
    });
  } else {
    next(createError("provide correct details", 400));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "login sucessfully",
    data: { ...user._doc, password: undefined },
  });
});

const getUser = asyncWrapper(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    next(createError("No user with such ID", 400));
  }

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "sucessfully",
    data: { ...user._doc, password: undefined, nbHits: user.length },
  });
});

const updateUser = asyncWrapper(async (req, res, next) => {
  const Id = req.params.id;
  const userId = req.user.id;
  const { email, username } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    next(createError("No user with such ID", 400));
  }

  if (userId === Id) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { email, username },
      {
        new: true,
      }
    );
    if (updatedUser) {
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "User updated sucessfully",
        data: { ...updatedUser._doc, password: undefined },
      });
    }
  } else {
    next(
      createError("you did not created this account so you cannot edit it", 402)
    );
  }
});

const deleteUser = asyncWrapper(async (req, res, next) => {
  const Id = req.params.id;
  const userId = req.user.id;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    next(createError("No user with such ID", 400));
  }

  if (userId === Id) {
    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (deletedUser) {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, msg: "User deleted sucessfully" });
    }
  } else {
    next(
      createError(
        "you did not created this account so you cannot delete it",
        402
      )
    );
  }
});

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(StatusCodes.OK).json({ success: true, msg: "logout successfull" });
};

module.exports = { register, login, logout, getUser, updateUser, deleteUser };
