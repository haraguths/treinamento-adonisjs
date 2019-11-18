'use strict'

const User = use("App/Models/User")
const Database = use('Database')
const Role = use('Role')
const Auth = use('Auth')

class AuthController {

    async register ({ request, response }) {
        const trx = await Database.beginTransaction()
        try {
          const { name, surname, email, password } = request.all()
          const user = await User.create({ name, surname, email, password }, trx)
          const userRole = await Role.findBy('slug', 'client')
          await user.roles().attach([userRole.id], null, trx)
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
        //
    }

    async logout({ request, response, auth }) {
        try{
            await auth.logout()
        } catch (e){
            response.send('Erro ao deslogar!')
        }
        response.send('usuário deslogado com sucesso')
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
