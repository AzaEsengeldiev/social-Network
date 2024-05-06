const { Schema, model } = require('mongoose')

const MessageSchema = new Schema(
	{
		chatId: String,
		senderId: String,
		text: String
	},

	{
		timestamps: true
	}
)

module.exports = model('Message', MessageSchema)
