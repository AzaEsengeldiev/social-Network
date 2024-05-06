const messageModel = require('../models/message-model')

class MessageService {
	async createMessage(chatId, senderId, text) {
		try {
			const message = new messageModel({ chatId, senderId, text })
			const response = await message.save()
			return response
		} catch (error) {
			console.error('Ошибка при создании сообщения:', error)
			throw error
		}
	}
	async getMessage(chatId) {
		try {
			const messages = await messageModel.find({chatId})
			return messages
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

module.exports = new MessageService()
