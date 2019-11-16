'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

class Image extends Model {

    // metodos chamados no momento de converte a informação do banco para json
    static get computed() {
        return ['url']
    }

    getUrl({ path }) {
        return `${Env.get('APP_URL')}/images/${path}`
    }
}

module.exports = Image
