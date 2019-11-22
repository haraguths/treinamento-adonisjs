'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')


const str_random = async (length = 40) => {
    let string = ''
    let len = string.length

    if(len < length) {
        let size = length - len
        let bytes = await crypto.randomBytes(size)
        let buffer = Buffer.from(bytes)

        string += buffer.toString('base64')
        .replace(/[^a-zA-Z0-0]/g, '')
        .substr(0, size)
    }
    return string
}

const manage_sigle_upload = async (file, path = null) => {
    path = path ? path : Helpers.publicPath('uploads')

    const random_name = await str_random(30)

    let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`

    await file.move(path, {
        name: filename
    })

    return file
}

const manage_multiple_uploads = async (file, path = null) => {
    path = path ? path : Helpers.publicPath('uploads')

    let successes = [], 
        errors = []

        await Promise.all(fileJar.files.map(async file => {
            let random_name = await str_random(30)
            let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`

            // move o arquivo
            await file.move(path, {
                name: filename
            })

            if(file.moved()) {
                successes.push(file)
            } else {
                errors.push(file.error())
            }
            
        }))

    return { successes, errors}
}

module.exports = {
    str_random,
    manage_sigle_upload,
    manage_multiple_uploads
}