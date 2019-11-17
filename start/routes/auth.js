'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

/**
 * Auth Routes
 */

 Route.group(() => {
     Route.post('register', 'AuthController.register').as('auth.register')
     Route.post('login', 'AuthController.login').as('auth.login')

     Route.post('refresh', 'AuthController.refresh').as('auth.refresh')
     Route.post('logout', 'AuthController.logout').as('auth.logout')

     Route.post('reset-password', 'AuthController.forgot').as('auth.login')
     Route.get('reset-password', 'AuthController.remember').as('auth.remember')
     Route.put('reset-password', 'AuthController.reset').as('auth.reset')

     Route.get('listTokens', 'AuthController.listTokens').as('auth.listTokens')
     Route.get('checkLogged', 'AuthController.checkLogged').as('auth.checkLogged')
 })
 .prefix('auth')
 .namespace('Auth')