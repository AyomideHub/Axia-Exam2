const express = require('express')
const router = express.Router()
const  {authenticateUser} = require('../middlewares/authentication')
const {register, getUser, deleteUser, updateUser, login, logout} = require('../controllers/user.controller')

router.post('/register', register)
router.post('/login', login)
router.get('/user/:id', authenticateUser,  getUser)
router.delete('/delete-user/:id', authenticateUser,  deleteUser)
router.patch('/update-user/:id', authenticateUser, updateUser)
router.post('/logout', authenticateUser, logout)


module.exports = router