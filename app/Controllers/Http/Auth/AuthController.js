'use strict'

const User = use("App/Models/User")
const Database = use('Database')
//const Role = use('Role')

class AuthController {

    async register ({ request, response }) {
        const trx = await Database.beginTransaction()
        try {
          const { name, surname, email, password } = request.all()
          const user = await User.create({ name, surname, email, password }, trx)
          //const userRole = await Role.findBy('slug', 'client')
          //await user.roles().attach([userRole.id], null, trx)
          await trx.commit()
          return response.status(201).send({ data: user})
        } catch (error) {
          await trx.rollback()
          return response.status(201).send({ message: 'Erro ao realizar cadastro!'})
        }
    }

    async login({ request, response, auth }) {
        const { email, password } = request.all()

        try{
            let data = await auth.withRefreshToken().attempt(email, password)

            return response.send({ data })
        } catch(e){
            return auth.token
        }
    }

    async refresh({ request, response, auth }) {
        var refresh_token = request.input('refresh_token')

        if (!refresh_token) {
            refresh_token = request.header('refresh_token')
        }

        const user = await auth.newRefreshToken().generateForRefreshToken(refresh_token)

        return response.send({ data: user })
    }

    async logout({ request, response, auth }) {
        var refresh_token = request.input('refresh_token')

        if (!refresh_token) {
            refresh_token = request.header('refresh_token')
        }

        await auth.authenticator('jwt').revokeTokens([refresh_token], true)
        return response.status(204).send({})
    }

    async forgot({ request, response }) {
        //
    }

    async remember({ request, response }) {
        //
    }

    async reset({ request, response }){
        //
    }

    async listTokens ({ auth }) {
        await auth.listTokens()
    }

    async checkLogged ({ auth }) {
        try {
            await auth.check()
        } catch (error) {
            console.log(error.message)
            return 'Usuário não logado'
        }
    }
}

module.exports = AuthController
