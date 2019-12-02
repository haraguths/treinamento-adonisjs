'use strict'

const Product = use('App/Models/Product')
const Transformer = use('App/Transformers/Admin/ProductTransformer')

class ProductController {

  async index ({ request, response, transform, pagination }) {
    const name = request.input('name')
    const query = Product.query()
    if(name) {
      query.where('name', 'LIKE', `%${name}%`)
    } 

    var products = await query.paginate(pagination.page, pagination.limit)
    products = await transform.paginate(products, Transformer)
    return response.send(products)
  }


  async store ({ request, response, transform }) {
    try {
      const { name, description, price, image_id } = request.all()
      var product = await Product.create({ name, description, price, image_id })
      product = await transform.item(product, Transformer)
      return response.status(201).send(product) 
    } catch (error) {
      return response.status(400).send({
        message: "Erro ao cadastrar!"
      })
    }
  }

  async show ({ params, request, response, view }) {
    var product = await Product.findOrFail(id)
    product = await transform.item(product, Transformer)
    return response.send(product)
  }


  async update ({ params, request, response, transform }) {
    var product = await Product.findOrFail(id)
    const { name, description, price, image_id  } = request.all()

    product.merge({ name, description, price, image_id  })
    await product.save()
    product = await transform.item(product, Transformer)
    return response.send(product)
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ProductController
