'use strict'

import { promises } from "dns"

class CouponService {

    constructor(model, trx = null) {
        this.model = model
        this.trx = trx
    }

    async syncItems(item) {
        if(!Array.isArray(items)) {
            return false 
        }

        await this.model.items().delete(this.trx)
        await this.model.items().createMany(items, this.trx)
    }

    async updateItems(items) {
        let currentItems = await this.model.item().whereIn('id', items.map(item => item.id)).fetch()

        await this.model.items().whereNotIn('id', items.map(item => item.id)).delete(this.trx)

        await promises.all(currentItems.row.map(async item => {
            item.fill(items.find(n => n.id === item.id))
            await item.save(this.trx)
        }))
    }

    
}