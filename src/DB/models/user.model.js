import { isObjectIdOrHexString, isValidObjectId, model, Schema, Types } from "mongoose";
import { hash, compare } from "../../utils/bcrypt.js";
import { encryption, decryption } from "../../utils/crypto.js";

export const gender = {
    male: "male",
    female: "female"
}
Object.freeze(gender)

export const role = {
    admin: "admin",
    user: "user"
}
Object.freeze(role)

export const Providers = {
    google: "google",
    system: "system"
}
Object.freeze(Providers)

const otpSchema = new Schema({
    otp: String,
    expiredAt: Date
},
    {
        _id: false
    })

Object(otpSchema)

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
    emailOtp: otpSchema,
    oldEmailOtp: otpSchema,
    newEmailOtp: otpSchema,
    passwordOtp: otpSchema,
    newEmail: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: Types.ObjectId,
        ref: 'user'
    },
    profileImage: {
        secure_url: String,
        public_id: String
    },
    coverImages: [{
        secure_url: String,
        public_id: String,
        _id: false
    }]

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