const { Timestamp } = require('mongodb')
const { Schema, model } = require('mongoose')

const chatSchema = new Schema(
	{
		members: Array
	},
	{
		timestamps: true
	}
)
module.exports = model('Chat', chatSchema)
