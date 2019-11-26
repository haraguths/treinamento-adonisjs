'use strict'

const Coupon = use('App/Models/Coupon')
const Database = use('Database')
const Service = use('App/Service/Coupon/CouponService')

class CouponController {

  async index ({ request, response, pagination }) {
    const code = request.input('code')

    const query = Coupon.query()

    if (code) {
      query.where('code', 'LIKE', `%${CODE}%`)
    }

    const coupons = await query.paginate(pagination.page, pagination.limit)
    return response.send(coupons)
  }

  async store ({ request, response }) {

  }

  async show ({ params: { id }, request, response, view }) {
    const coupo = await Coupon.findOrFail(id)
    return response.send(coupo)
  }

  async update ({ params: { id }, request, response }) {
    const trx = await Database.beginTransaction()

    var can_use_for = {
      client: false,
      product: false
    }

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type',
        'recursive'
      ])
      const { users, products } = request.only(['users', 'products'])

      const coupon = await Coupon.create(couponData, trx)

      const service = new Service(coupon, trx)

      if (users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      if (products && products.length > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }

      if(can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'product_cliente'
      } else if(can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'product'
      } else if(!can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'cliente'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()

      return response.status(201).send(coupon)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não deu certo'
      })
      
    }

  }

  async destroy ({ params: { id }, request, response }) {
    const trx = await Database.beginTransaction()
    const coupon = await Coupon.findOrFail(id)
    try {
      await coupon.products([], trx)
      await coupon.orders([], trx)
      await coupon.users([], trx)
      await coupon.delete(trx)
      await coupon.commit()
      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Erro ao deletar'
      })
    }
  }
}

module.exports = CouponController
