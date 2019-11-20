'use strict'

const Product = use('App/Models/Product')

class ProductController {

  async index ({ request, response, pagination }) {

    const name = request.input('name')
    const query = Product.query()

    if(title) {
      query.where('name', 'ILIKE', `%${name}%`)
    }

    const produts = await query.paginate(pagination.page, pagination.limit)
    return response.send(produts)
  }

  async store ({ request, response }) {
    try {
      const { name, description, price, image_id } = request.all()
      const product = await Product.create({ name, description, price, image_id })
      return response.status(201).send(product) 
    } catch (error) {
      return response.status(400).send({
        message: "Erro ao cadastrar!"
      })
    }
  }

  async show ({ params: { id }, request, response, view }) {
    const product = await Product.findOrFail(id)
    return response.send(product)
  }

  async update ({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)

    try {
      const { name, description, price, image_id } = request.all()

      product.merge({ name, description, price, image_id })
      await product.save()

      return response.send(product)
    } catch (error) {
      return response.status(400).send({ message: 'Erro ao alterar produto.'})
    }
    
  }

  async destroy ({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)
    try {
      await product.delete()
      await response.status(204).send()
    } catch (error) {
      return response.status(500).send({ message: 'Erro ao deletar produto.'})
    }

  }
}

module.exports = ProductController
