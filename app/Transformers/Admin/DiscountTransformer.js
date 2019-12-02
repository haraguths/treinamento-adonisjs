'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const CouponTransformer = use('App/Transformers/Admin/CouponTransformer')

/**
 * DiscountTransformer class
 *
 * @class DiscountTransformer
 * @constructor
 */
class DiscountTransformer extends BumblebeeTransformer {

  defaultInclude() {
    return ['coupon']
  }

  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      amount: model.discount
    }
  }

  includeCoupons(order) {
    return this.item(order.getRelated('coupons'), CouponTransformer)
  }
}

module.exports = DiscountTransformer
