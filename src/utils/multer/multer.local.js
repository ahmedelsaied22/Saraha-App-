import multer, { diskStorage } from "multer"
import fs from 'fs/promises'
import { nanoid } from "nanoid"

const fileTypes = {
    image: ['image/jpeg', 'image/png', 'image/jpg']
}

export const uploadFile = (folderName = 'general', type = fileTypes.image) => {
    const storage = diskStorage({
        destination: async (req, file, cb) => {
            const folder = `uploads/${folderName}/${req.user.firstName}`
            await fs.access(folder).catch(async () => {
                await fs.mkdir(folder, { recursive: true })
            })

            cb(null, folder)
        },
        filename: (req, file, cb) => {
            cb(null, `${nanoid(10)}_${file.originalname}`)
        }
    })
    const fileFilter = (req, file, cb) => {
        if (!type.includes(file.mimetype)) {
            return cb(new Error('in-valid file type'), false)
        } else {
            return cb(null, true)
        }
    }
    return multer({ storage, fileFilter })
}