import { model, Schema } from "mongoose";
import { hash, compare } from "../../utils/bcrypt.js";
import { encryption, decryption } from "../../utils/crypto.js";

export const gender = {
    male: "male",
    female: "female"
}

export const role = {
    admin: "admin",
    user: "user"
}

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        set(value) {
            return hash(value)
        }
    },
    age: {
        type: Number,
        min: 20,
        max: 60
    },
    gender: {
        type: String,
        enum: Object.values(gender),
        default: gender.male
    },
    role: {
        type: String,
        enum: Object.values(role),
        default: role.user
    },
    phone: {
        type: String,
        require: true,
        set(value) {
            return encryption(value)
            // return CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY)
        },
        get(value) {
            return decryption(value)
        }
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    emailOtp: {
        otp: String,
        expiredAt: Date
    },
    passwordOtp: {
        otp: String,
        expiredAt: Date
    }
}, {
    timestamps: true,
    toJSON: {
        getters: true,
        setters: true
    },
    virtuals: {
        fullName: {
            get() {
                return this.firstName + " " + this.lastName
            }
        }
    },
    methods: {
        comparePassword(password) {
            return compare(password, this.password)
        }
    }

})

export const userModel = model('user', userSchema)