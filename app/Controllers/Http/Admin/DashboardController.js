'use strict'

const DB = use('Database')

class DashboardController {
    async indexedDB({ response }) {
        const users = await DB.from('users').getCount()
        const orders = await DB.from('orders').getCount()
        const products = await DB.from('products').getCount()
        const subtotal = await DB.from('order_items').getSum('subtotal')
        const discounts = await DB.from('users').getSum('discounts')
        const revenues = subtotal - discounts
        return response.send({ users,orders,products,revenues})
    }

}

module.exports = DashboardController
