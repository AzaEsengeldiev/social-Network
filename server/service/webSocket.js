const socketIo = require('socket.io')

const initWebSocket = server => {
	const io = socketIo(server, {
		cors: {
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST']
		}
	})
	let onlineUsers = []

	io.on('connection', socket => {
		console.log(`Новый клиент подключился: ${socket.id}`)

		socket.on('joinRoom', room => {
			socket.join(room)
			console.log(`Клиент ${socket.id} присоединился к комнате ${room}`)
		})

		socket.on('addNewUser', (userId, email) => {
			!onlineUsers.some(user => user.userId === userId)
			onlineUsers.push({
        email,
				userId,
				socketId: socket.id
			})
      console.log('onlineUsers', onlineUsers);
		})

		socket.on('message', ({ recipientId, message }) => {
			try {
				io.to(recipientId).emit('message', { recipientMessage: message })
				socket.emit('message', { senderMessage: message })
				console.log(`Новое сообщение пользователю ${recipientId} = ${message}`)
			} catch (error) {
				console.log(`Ошибка при отправке сообщения: ${error}`)
			}
		})

		socket.on('disconnect', () => {
			console.log(`Клиент ${socket.id} отключился`)
		})
	})
}

module.exports = initWebSocket
