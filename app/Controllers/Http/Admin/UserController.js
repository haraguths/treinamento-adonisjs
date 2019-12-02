'use strict'

const User = use('App/Models/User')

class UserController {

  async index ({ request, response, pagination, transform }) {

    const name = request.input('name')
    const query = User.query()

    if(name) {
      query.where('name', 'ILIKE', `%${name}%`)
      query.orWhere('surname', 'ILIKE', `%${name}%`)
      query.orWhere('email', 'ILIKE', `%${name}%`)
    }

    var users = await query.paginate(pagination.page, pagination.limit)
    users = await transform.paginate(users, Transformer)

    return response.send(users)
  }


  async store ({ request, response, transform }) {
    try {
      const { name, surname, email, password, image_id } = request.all()
      var  user = await User.create({ name, surname, email, password, image_id })
      user = await transform.item(user, Transformer)

      return response.status(201).send(user) 
    } catch (error) {
      return response.status(400).send({
        message: "Erro ao cadastrar!"
      })
    }
  }

  async show ({ params: { id }, response }) {
    const user = await User.findOrFail(id)
    user = await transform.item(user, Transformer)
    return response.send(user)
  }
 
  async update ({ params: { id }, request, response }) {
    var user = await User.findOrFail(id)

    try {
      const userData = request.only([name, surname, email, password, image_id ])
      user.merge(userData)
      await user.save()
      user = await transform.item(user, Transformer)
      return response.status(201).send(user) 
    } catch (error) {
      return response.status(400).send({
        message: "Erro ao editar!"
      })
    }

  }


  async destroy ({ params: { id }, request, response }) {
    const user = await User.findOrFail(id)
    try {
      await user.delete()
      await response.status(204).send()
    } catch (error) {
      return response.status(500).send({ message: 'Erro ao deletar user.'})
    }

  }
}

module.exports = UserController
