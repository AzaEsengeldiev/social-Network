const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dtos')
const userModel = require('../models/user-model')
const ApiError = require('../exceptions/api-error')

class UserService {
	async registration(email, password) {
		try {
			const candidate = await userModel.findOne({ email })
			if (candidate) {
				throw ApiError.BadRequest(
					`Пользователь с почтовым адресом ${email} уже существует`
				)
			}
			const hashPassword = await bcrypt.hash(password, 10)
			const activationLink = uuid.v4()
			const user = await userModel.create({
				email,
				password: hashPassword,
				activationLink
			})

			await mailService.sendActivationMail(
				email,
				`${process.env.API_URL}/api/activate/${activationLink}`
			)
			const userDto = new UserDto(user)
			const tokens = await tokenService.generateTokens({ ...userDto })
			await tokenService.saveToken(userDto.id, await tokens.refreshToken)
			return { ...tokens, user: userDto }
		} catch (error) {
			console.error(error)
			throw ApiError.BadRequest(error.message)
		}
	}
	async activate(activationLink) {
		try {
			const user = await userModel.findOne({ activationLink })
			if (!user) {
				throw ApiError.BadRequest('Неккоректная ссылка активации')
			}
			user.isActivated = true
			await user.save()
		} catch (error) {
			console.log(error)
		}
	}
	async login(email, password) {
		try {
			const user = await userModel.findOne({ email })
			if (!user) {
				throw ApiError.BadRequest('Пользователь с таким email не найден')
			}
			const isPassEquals = await bcrypt.compare(password, user.password)
			if (!isPassEquals) {
				throw ApiError.BadRequest('Неверный пароль')
			}
			const userDto = new UserDto(user)
			const tokens = await tokenService.generateTokens({ ...userDto })
			await tokenService.saveToken(userDto.id, await tokens.refreshToken)
			return { ...tokens, user: userDto }
		} catch (error) {
			console.log(error)
			next(error)
		}
	}
	async logout(refreshToken) {
		const token = tokenService.removeToken(refreshToken)
		return token
	}
	async refresh(refreshToken) {
		try {
			if (!refreshToken) {
				throw ApiError.UnauthorizedError()
			}
			const userData = tokenService.validateRefreshToken(refreshToken)
			const tokenFromDb = await tokenService.findToken(refreshToken)
			if (!userData || !tokenFromDb) {
				throw ApiError.UnauthorizedError()
			}
			const user = await userModel.findById(userData.id)
			const userDto = new UserDto(user)
			const tokens = await tokenService.generateTokens({ ...userDto })
			await tokenService.saveToken(userDto.id, await tokens.refreshToken)
			return { ...tokens, user: userDto }
		} catch (error) {
			console.log(error)
		}
	}
	async getAllUsers() {
		const users = await userModel.find()
		return users
	}
	async removeUser(id) {
		try {
			const user = await userModel.findByIdAndDelete(id)
			console.log('Пользователь успешно удален')
			return user
		} catch (error) {
			console.log(error)
		}
	}
}

module.exports = new UserService()
