const express = require('express')
const authmiddleWare = require('../Middlewares/auth.middleware')
const { createPost, getAllPosts, getPostById, postComment, getPostComments, deletePost } = require('../controllers/post.controller')
const router = express.Router()


router.post('/:id/comments', authmiddleWare,  postComment)
router.post('/', authmiddleWare, createPost)
router.get('/:id', getPostById)
router.get('/:id/comments', getPostComments)
router.get('/',  getAllPosts)
router.delete('/:id', authmiddleWare, deletePost)



module.exports = router