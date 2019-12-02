'use strict'

class AuthRegister {

  get rules () {
    return {
      email: 'required|email',
      name: 'required',
      surname: 'required',
      password: 'required|confirmed'
    }
  }

  get messages() {
    return {
      'name.required': 'O nome é obrigatório.',
      'surname.required': 'O sobrenome é obrigatório.',
      'email.email': 'O email é inválido.',
      'email.unique': 'O nome já existe.',
      'password.required': 'A senha é obrigatório.',
      'password.confirmed': 'As senhas não são iguais.'
    }
  }
}

module.exports = AuthRegister
