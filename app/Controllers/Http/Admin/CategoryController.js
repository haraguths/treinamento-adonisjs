'use strict'

const Category = use('App/Models/Category')
const Transformer = use('App/Transformers/Admin/CategoryTransformer')

class CategoryController {

  async index ({ request, response, transform, pagination }) {

    const title = request.input('title')
    const query = Category.query()

    if(title) {
      query.where('title', 'ILIKE', `%${title}%`)
    }

    var categories = await query.paginate(pagination.page, pagination.limit)
    categories = await transform.paginate(categories, Transformer)
    return response.send(categories)
  }

 
  async store ({ request, response, transform }) {
    try {
      const { title, description, image_id } = request.all()
      var category = await Category.create({ title, description, image_id })
      category = await transform.item(category, Transformer)
      return response.status(201).send(category) 
    } catch (error) {
      return response.status(400).send({
        message: "Erro ao cadastrar!"
      })
    }
  }
 
  async show ({ params: { id }, request, response, transform }) {
    var category = await Category.findOrFail(id)
    category = await transform.item(category, Transformer)
    return response.send(category)
  }


  async update ({ params: { id }, request, response, transform }) {
    var category = await Category.findOrFail(id)
    const { title, description, image_id } = request.all()

    category.merge({ title, description, image_id })
    await category.save()
    category = await transform.item(category, Transformer)
    return response.send(category)
  }

  async destroy ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)
    await category.delete()
    await response.status(204).send()
  }
}

module.exports = CategoryController
