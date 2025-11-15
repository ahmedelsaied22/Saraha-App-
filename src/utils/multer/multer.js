import multer, { diskStorage } from "multer"
import fs from 'fs/promises'
import { nanoid } from "nanoid"

export const uploadFile = (folderName = 'general') => {
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
    return multer({ storage })
}