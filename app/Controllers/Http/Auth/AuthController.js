'use strict'

const User = use("App/Models/User")

class AuthController {
    /**
     * Método para criar token de autenticação do usuário
     * @param {email} Email para login
     * @param {senha} Senha do usuário 
     */
    async register ({ request, auth }) {
        const { email, password } = request.only(['email', 'password']);

        const token = await auth.attempt(email, password)

        return token
    }

    /**
     * Método para realizar login do usuário no sistema
     * @param {email} Email do usuário
     * @param {password} senha não criptografada
     */
    async login({ request, response, auth }) {
        const { email, password } = request.only([ 'email', 'password' ])

        try{
            const { token } = await auth.attempt(email, password)

            return { token }
        } catch(e){
            return auth.token
        }
    }

    async refresh({ request, response, auth }) {
        //
    }

    /**
     * Método para deslogar usuário do sistema
     * @param {auth} Autenticação dos dados
     */
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
