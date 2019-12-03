'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('v1/me', 'UserController.me').as('me').middleware('auth')

/**
 * Importa Rotas auth
 */
require('./auth')

/**
 * Importa Rotas admin
 */
require('./admin')

/**
 * Importa Rotas admin
 */
require('./client')