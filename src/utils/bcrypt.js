import { compareSync, hashSync } from "bcryptjs"

export const hash = (password) => {
    return hashSync(password, Number(process.env.HASH_KEY))
}

export const compare = (text, cipherText) => {
    return compareSync(text, cipherText)
}