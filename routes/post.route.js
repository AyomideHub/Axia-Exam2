const express = require('express')
const router = express.Router()
const  {authenticateUser } = require('../middlewares/authentication')
const {createPost, deletePost, updatePost, getPosts, getPost} = require('../controllers/post.controller')

router.get('/post/:id', authenticateUser,  getPost)
router.get('/posts', authenticateUser,  getPosts)
router.post('/create-post', authenticateUser,  createPost)
router.delete('/delete-post/:id', authenticateUser,  deletePost)
router.patch('/update-post/:id', authenticateUser,  updatePost)



module.exports = router