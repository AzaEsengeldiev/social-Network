const chatService = require('../service/chat-service')

class ChatController {
	async createChat(req, res) {
		const { firstId, secondId } = req.body
		try {
			const chat = await chatService.createChat(firstId, secondId)
			res.status(200).json(chat)
		} catch (error) {
			console.error('Ошибка при создании чата:', error)
			res.status(500).json({ message: 'Ошибка при создании чата', error })
		}
	}

	async findUserChats(req, res) {
		const userId = req.params.id
		try {
			const chats = await chatService.findUserChats(userId)
			res.status(200).json(chats)
		} catch (error) {
			console.error('Ошибка при поиске чатов пользователя:', error)
			res
				.status(500)
				.json({ message: 'Ошибка при поиске чатов пользователя', error })
		}
	}

	async findChat(req, res) {
		const { firstId, secondId } = req.params
		try {
			const chat = await chatService.findChat(firstId, secondId)
			res.status(200).json(chat)
		} catch (error) {
			console.error('Ошибка при поиске чата:', error)
			res.status(500).json({ message: 'Ошибка при поиске чата', error })
		}
	}
}

module.exports = new ChatController()
