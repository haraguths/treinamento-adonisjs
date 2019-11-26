'use strict'

const Order = use('App/Models/Order')
const Database = use('Database')
const Service = use('App/Service/Coupon/OrderService')


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

  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try {
      const { user_id, items, status } = requestAll()
      let order = await Order.create({ user_id, items, status }, trx)
      const service = new Service(order, trx)
      if(items && items.length > 0) {
        await service.syncItems(items)
      }

      await trx.commit()
      return response.status(201).send(order)
    } catch (error) {
      await trx.rollback()
      return respons.status(400).send({
        message: 'Nao foi possivel criar pedido.'
      })
    }
  }

  async show ({ params: { id }, response }) {
    const order = await Order.findOrFail(id)
    return response.send(order)
  }

  async update ({ params, request, response }) {
    const order = await Order.findOrFail(id)
    const trx = await Database.beginTransaction()
    try {
      const { user_id, items, status } = request.all()
      order.merge(user_id, status)
      const service = new Service(order, trx)
      await service.updateItems(items)
      await order.save(trx)
      await trx.commit()
      return response.send(order)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'não foi possivel editar order!'
      })
    }
  }


  async destroy ({ params, request, response }) {
    const order = await Order.findOrFail(id)
    const trx = await Database.beginTransaction()
    try {
      await order.items().delete(trx)
      await order.coupons().delete(trx)
      await order.delete(trx)
      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao deletar este pedido!'
      })
    }
  }
}

module.exports = OrderController
