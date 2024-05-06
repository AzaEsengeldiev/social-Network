require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router')
const errorMiddlewares = require('./middlewares/error-middlewares')
const initWebSocket = require('./service/webSocket')

const app = express()
const PORT = process.env.PORT || 4000
app.use(express.json())
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL
	})
)
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddlewares)

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL)
		const server = await app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`)
		})
		initWebSocket(server)
	} catch (error) {
		console.log(error)
	}
}
start()
