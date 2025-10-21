import 'dotenv/config'
import CryptoJS from "crypto-js"

export const encryption = (text) => {
    return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString()
}


export const decryption = (cipherText) => {
    return CryptoJS.AES.decrypt(cipherText, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
}