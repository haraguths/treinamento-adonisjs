'use strict'

const Order = use('App/Models/Order')


class OrderController {

  async index ({ request, response, pagnate }) {
    const { status, id } = request.only(['status', 'id'])

    const query = Order.query()

    if(status && id) {
      query.where('status', status)
      query.orWhere('id', 'LIKE', `%${id}%`)
    } else if(status) {
      query.where('status', status)
    } else if(id) {
      query.orWhere('id', 'LIKE', `%${id}%`)
    }

    const orders = query.paginate(pagnate.page, pagnate.limit)
    return response.send(orders)
  }

  async create ({ request, response, view }) {
  }

  async store ({ request, response }) {
  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
  }

  
  async update ({ params, request, response }) {
  }


  async destroy ({ params, request, response }) {
  }
}

module.exports = OrderController
