const Post = require("../models/post.model");
const { StatusCodes } = require("http-status-codes");
const {asyncWrapper} = require("../middlewares/asyncwrapper")
const {createError} = require('../middlewares/customError')

const createPost = asyncWrapper(async (req, res, next) => {
  const { title, content, tag } = req.body;
  const userId = req.user.id;

  if (!title || !content || !tag) {
    next(createError("All field are required", 400))
  }

  const post = await Post.findOne({ title });
  if (post) {
    next(createError("Post Already exist", 403))
  }

  const newpost = await Post.create({
    title,
    content,
    tag,
    createdBy: userId,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Post Created sucessfully",
    data: { ...newpost._doc },
  });

});

const deletePost = asyncWrapper (async (req, res) => {
  const postId = req.params.id;

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      next(createError("No post with such ID", 404))
    }

    const deletedPost = await Post.findOneAndDelete({ _id: postId });

    if (deletedPost) {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, msg: "Post deleted sucessfully" });
    } 
});

const updatePost = asyncWrapper( async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findOne({ _id: postId });
    if (!post) {
      rnext(createError("No post with such ID", 404))
    }

    const updatedPost = await Post.findOneAndUpdate({ _id: postId }, req.body, {
      new: true,
      runValidators: true,
    });

    if (updatedPost) {
      return res.status(StatusCodes.OK).json({
        success: true,
        msg: "Post updated sucessfully",
        data: { updatedPost },
      });
    }
   
});

const getPosts = asyncWrapper ( async (req, res) => {
  const posts = await Post.find({}).populate("createdBy", "username email");

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "sucessfully",
    data: { posts, nbHits: posts.length },
  });
});

const getPost = asyncWrapper (async (req, res) => {
  const postId = req.params.id;

    const post = await Post.findOne({ _id: postId }).populate(
      "createdBy",
      "username email"
    );
  
    if (!post) {
      next(createError("No post with such ID", 404))
    }
  
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "sucessfully",
      data: { post, nbHits: post.length },
    });
 
});

module.exports = { createPost, deletePost, updatePost, getPosts, getPost };
