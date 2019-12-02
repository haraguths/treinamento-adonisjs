'use strict'

const Order = use('App/Models/Order')
const Database = use('Database')
const Service = use('App/Service/Coupon/OrderService')


class OrderController {

  async index ({ request, response, pagination, transform }) {
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

    var orders = await query.paginate(pagination.page, pagination.limit)
    orders = await transform.paginate(orders, Transformer)

    return response.send(orders)
  }

  async store ({ request, response, transform }) {
    const trx = await Database.beginTransaction()
    try {
      const { user_id, items, status } = requestAll()
      let order = await Order.create({ user_id, items, status }, trx)
      const service = new Service(order, trx)
      if(items && items.length > 0) {
        await service.syncItems(items)
      }

      order = await transform.item(order, Transformer)

      await trx.commit()
      return response.status(201).send(order)
    } catch (error) {
      await trx.rollback()
      return respons.status(400).send({
        message: 'Nao foi possivel criar pedido.'
      })
    }
  }

  async show ({ params: { id }, response, transform }) {
    const order = await Order.findOrFail(id)
    order = await transform.item(order, Transformer)

    return response.send(order)
  }

  async update ({ params, request, response, transform }) {
    var order = await Order.findOrFail(id)
    const trx = await Database.beginTransaction()
    try {
      const { user_id, items, status } = request.all()
      order.merge(user_id, status)
      const service = new Service(order, trx)
      await service.updateItems(items)
      await order.save(trx)
      await trx.commit()
      order = await transform.item(order, Transformer)
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

  async applyDiscount({ params: {id}, request, response }) {
    const { code } = request.all()
    const coupon = await coupon.findOrFail('code', code.toUpperCase())
    const order = await Order.findOrFail(id)

    var discount, info = {}

    try {
      const service = new Service(order)
      const canAddDiscount = await service.canApplyDiscount(coupon)
      const orderDiscount = await order.coupons().getCount()

      const cannApplyToOrder = orderDiscount < 1 || (orderDiscount >= 1 && coupon.recursive)
      if (canAddDiscount && cannApplyToOrder) {
        discount = await discount.findOrCreate({
          order_id = order.id,
          coupon_id = coupon.id
        })
        info.message = 'Cupon aplicado com sucesso!'
        info.sucess = true
      } else {
        info.message = 'Não foi possivel aplicar esse disconto.'
        info.sucess = false
      }

      return response.send({ order, info})
    } catch (error) {
      return response.status(400).send({ message: 'Erro ao aplicar o cupom!' })
    }

  }

  async removeDiscount({request, responde }) {
    const { discount_id } =request.all()
    const discount = await discount.findOrFail(discount_id)
    await discount.delete()
    return response.status(204).send()
  }

}

module.exports = OrderController
