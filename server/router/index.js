const Router = require('express').Router
const userControllers = require('../controllers/user-controllers')
const router = new Router()
const { body } = require('express-validator')
const authMiddlewares = require('../middlewares/auth-middlewares')
const chatController = require('../controllers/chat-controller')
const messageController = require('../controllers/message-controller')

router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }),
	userControllers.registration
)
router.post('/login', userControllers.login)
router.post('/logout', userControllers.logout)
router.get('/activate/:link', userControllers.activate)
router.get('/refresh', userControllers.refresh)
router.get('/users', authMiddlewares, userControllers.getUsers)
router.delete('/users/:id', authMiddlewares, userControllers.removeUserID)
router.post('/chat', chatController.createChat)
router.get('/chat/:id', chatController.findUserChats)
router.get('/chat/find/:firstId/:secondId', chatController.findChat)
router.post('/message', messageController.createMessage)
router.get('/message/:chatId', messageController.getMessage)
module.exports = router
