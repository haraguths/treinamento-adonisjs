'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('title', 255).unsigned()
      table.text('description')
      table.decimal('price', 12,2)
      table.timestamps()


      table.foreign('image_id').references('id').inTable('images').onDelete('cascade')

    })


    this.create('image_product', table => {
      table.increments()
      table.integer('image_id').unsigned()
      table.integer('product_id').inTable()
      table.foreign('image_id').references('id').inTable('images').onDelete('cascade')
      table.foreign('product_id').references('id').inTable('products').onDelete('cascade')
    })

    this.create('categotu_product', table => {
      table.increments()
      table.integer('product_id').unsigned()
      table.integer('category_id').unsigned()

      table.foreign('product_id').references('id').inTable('products').onDelete('cascade')
      table.foreign('category_id').references('id').inTable('category').onDelete('cascade')

    })
  }

  down () {
    this.drop('category_product')
    this.drop('image_product')
    this.drop('products')

  }
}

module.exports = ProductSchema
