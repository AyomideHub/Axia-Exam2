const Post = require("../models/post.model");
const { StatusCodes } = require("http-status-codes");

const createPost = async (req, res) => {
  const { title, content, tag } = req.body;
  const userId = req.user.id;

  if (!title || !content || !tag) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "All field are required" });
  }

  const post = await Post.findOne({ title });

  if (post) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: "Post Already exist" });
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
};

const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, msg: "No post with such ID" });
    }

    const deletedPost = await Post.findOneAndDelete({ _id: postId });

    if (deletedPost) {
      return res
        .status(StatusCodes.OK)
        .json({ success: true, msg: "Post deleted sucessfully" });
    } 

  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "No post with such ID" });
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
   
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

const getPosts = async (req, res) => {
  const posts = await Post.find({}).populate("createdBy", "username email");

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "sucessfully",
    data: { posts, nbHits: posts.length },
  });
};

const getPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findOne({ _id: postId }).populate(
      "createdBy",
      "username email"
    );
  
    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, msg: "No post with such ID" });
    }
  
    res.status(StatusCodes.OK).json({
      success: true,
      msg: "sucessfully",
      data: { post, nbHits: post.length },
    });
    
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error); 
  }

  
};

module.exports = { createPost, deletePost, updatePost, getPosts, getPost };
