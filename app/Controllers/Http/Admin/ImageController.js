'use strict'

const Image = use('App/Models/Image')
const { manage_single_upload, manage_multiple_uploads } = use('App/Helpers')
const fs = use('fs')
const Transformer = use('App/Transformers/Admin/ImageTransformer')

class ImageController {

  async index ({ response, pagination, transform }) {
    var images = await Image.query()
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.limit)
    
    images = await transform.paginate(images, Transformer)

    return response.send(images)
  }

  async store ({ request, response, transform }) {
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

           const transformImage = await transform.item(image, Transformer)
           images.push(transformImage)

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
          const transformImage = await transform.item(image, Transformer)
          images.push(transformImage)
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

  async show ({ params: { id }, request, response, transform }) {
    var image = await Image.findOrFail(id)
    image = await transform.item(image, Transformer)
    return response.send(image)
  } 

  async update ({ params: { id }, request, response, transform }) {
    var image = await Image.findOrFail(id)

    try {
      image.merge(request.only(['original_name']))
      await image.save()
      image = await transform.item(image, Transformer)
      return response.status(200).send(image)
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

      fs.unlinkSync(filePath)
      await image.delete()    

      return response.status(204).send()
    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possivel deletar.'
      })
    }
  }
}

module.exports = ImageController
