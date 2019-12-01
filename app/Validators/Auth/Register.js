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
}

module.exports = AuthRegister
