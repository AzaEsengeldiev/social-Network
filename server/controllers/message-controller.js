const messageService = require('../service/message-service')

class MessageController {
	async createMessage(req, res) {
		const { chatId, senderId, text } = req.body
		try {
			const message = await messageService.createMessage(chatId, senderId, text)
			res.status(200).json(message)
		} catch (error) {
			console.error('Ошибка при создании сообщения:', error)
			res.status(500).json({ message: 'Ошибка при создании сообщения', error })
		}
	}
	async getMessage(req, res) {
		const { chatId } = req.params
		try {
			const messages = await messageService.getMessage(chatId)
			res.status(200).json(messages)
		} catch (error) {
			res.status(500).json(error)
		}
	}
}

module.exports = new MessageController()
