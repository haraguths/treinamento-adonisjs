'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ImageTransformer class
 *
 * @class ImageTransformer
 * @constructor
 */
class ImageTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    image = image.toJSON()
    return {
      id: Image.id,
      url: Image.url,
      size: image.size,
      original_name: image.original_name
    }
  }
}

module.exports = ImageTransformer
