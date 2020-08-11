import fs from 'fs'
import path from 'path'

import activeDir from './path'

export const deleteImage = (imageName: string) => {
  return new Promise((resolve, reject) => {
    const imagePath = path.join(activeDir, 'data', 'images', imageName)
    fs.unlink(imagePath, error => {
      if (error) reject(`File deletion failed: ${error.message}`)
      resolve('File deletion succeeded')
    })
  })
}