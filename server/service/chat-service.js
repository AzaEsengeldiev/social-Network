const chatModel = require('../models/chat-model')

class ChatService {
	async createChat(firstId, secondId) {
		try {
			const chat = await chatModel.findOne({
				members: { $all: [firstId, secondId] }
			})

			if (chat) {
				return chat
			}

			const newChat = new chatModel({
				members: [firstId, secondId]
			})

			const response = await newChat.save()
			return response
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async findUserChats(userId) {
		try {
			const chats = await chatModel.find({ members: { $in: [userId] } })
			return chats
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async findChat(firstId, secondId) {
		try {
			const chat = await chatModel.findOne({
				$or: [
					{ members: [firstId, secondId] },
					{ members: [secondId, firstId] }
				]
			})
			return chat
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}

module.exports = new ChatService()
