import env from '#start/env'
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
})

export default class ClaudinaryService {
  static async uploadImage(
    localpath: string,
    folder: string = env.get('CLOUDINARY_FOLDER') || 'sigeva'
  ): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        localpath,
        { folder, resource_type: 'image', overwrite: true },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) {
            reject(error)
          }

          if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
            })
          } else {
            reject(new Error('No se pudo subir la imagen'))
          }
        }
      )
    })
  }

  static async delete(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: 'image' },
        (error?: UploadApiErrorResponse) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        }
      )
    })
  }
}
