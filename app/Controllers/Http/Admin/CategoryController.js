'use strict'

const Category = use('App/Models/Category')

class CategoryController {

  async index ({ request, response, view, pagination }) {

    const title = request.input('title')
    const query = Category.query()

    if(title) {
      query.where('title', 'ILIKE', `%${title}%`)
    }

    const categories = await query.paginate(pagination.page, pagination.limit)
    return response.send(categories)
  }

 
  async store ({ request, response }) {
    try {
      const { title, description, image_id } = request.all()
      const category = await Category.create({ title, description, image_id })
      return response.status(201).send(category) 
    } catch (error) {
      return response.status(400).send({
        message: "Erro ao cadastrar!"
      })
    }
   
  }
 
  async show ({ params: { id }, request, response, view }) {
    const category = await Category.findOrFail(id)
    return response.send(category)
  }


  async update ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)
    const { title, description, image_id } = request.all()

    category.merge({ title, description, image_id })
    await category.save(category)
    
    return response.send(category)
  }

  async destroy ({ params: { id }, request, response }) {
    const category = await Category.findOrFail(id)
    await category.delete()
    await response.status(204).send()
  }
}

module.exports = CategoryController
