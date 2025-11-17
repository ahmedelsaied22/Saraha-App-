import cloudinary from "./cloud.config.js"


export const uploadSingleFile = async ({ path }) => {
    const { secure_url, public_id } = await cloudinary.uploader.upload(path)
    return { secure_url, public_id }
}

export const destroySingleFile = async ({ public_id }) => {
    await cloudinary.uploader.destroy(public_id)
}

export const uploadMultiFile = async ({ paths = [] }) => {

    if (paths.length == 0) {
        throw new Error("no files to upload")
    }
    const images = []
    for (const path of paths) {
        const { secure_url, public_id } = await uploadSingleFile({ path })
        images.push({ secure_url, public_id })
    }
    return images
}