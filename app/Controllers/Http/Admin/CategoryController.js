'use strict'

const Category = use('App/Models/Category')

class CategoryController {

  async index ({ request, response, view, pagination }) {

    const title = request.input('title')
    const query = Category.query()

    if(title) {
      query.where('title', 'LIKE', `%${title}%`)
    }

    const categories = await query.paginate(pagination.page, pagination.limit)
    return response.send(categories)
  }

 
  async store ({ request, response }) {
  }

 
  async show ({ params, request, response, view }) {
  }


  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = CategoryController
