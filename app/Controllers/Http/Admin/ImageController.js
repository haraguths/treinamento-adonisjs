'use strict'

const Image = use('App/Models/Image')
const { manage_single_upload, manage_multiple_uploads } = use('App/Helpers')
const fs = use('fs')

class ImageController {

  async index ({ response, pagination }) {
    const images = await Image.query()
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.limit)

      return response.send(images)
  }

  async store ({ request, response }) {
    try {
      const fileJar = request.file('images', {
        type: ['image'],
        size: '2mb'
      })

      let images = []

      if (!fileJar.files) {
        const file = await manage_single_upload(fileJar)
        if (file.moved()) {
          const image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          })
           images.push(image)

           return response.status(201).send({ successes: images, errors: {} })
        }
        return response.status(400).send({
          message: "Não foi possivel processar esta imagem."
        })
      } 


      let files = await manage_multiple_uploads(fileJar)

      await Promise.all(
        files.successes.map(async file => {
          const image = await Image.create({
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          })
          images.push(image)
        })
      )
      return response.status(201).send({
        successes: images, errors: files.error
      })
    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possivel salvar'
      })
    }
  }

  async show ({ params: { id }, request, response, view }) {
    const image = await Image.findOrFail(id)
    return response.send(image)
  } 

  async update ({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)

    try {
      image.merge(request.only(['original_name']))
      await image.save()
      response.status(200).send(image)
    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possivel alterar'
      })
    }

  }

  async destroy ({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)

    try {

      let filePath = Helpers.publicPath(`uploads/${image.path}`)

      await fs.unlink(filePath, err => {
        if(!err)
        await image.delete()
      })

      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possivel deletar.'
      })
    }
  }
}

module.exports = ImageController
