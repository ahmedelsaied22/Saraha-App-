
export class notFoundEmail extends Error {
    constructor() {
        super("Email Not Found", { cause: 404 })
    }
}


export class emailAlreadyExist extends Error {
    constructor() {
        super("Email Already Exist", { cause: 404 })
    }
}


export class validationError extends Error {
    constructor() {
        super("validation Error", { cause: 404 })
    }
}


export class invalidCredentionals extends Error {
    constructor() {
        super("in-valid Credentials")
    }
}


// token
export class invalidTokenException extends Error {
    constructor() {
        super("in-valid token", { cause: 409 })
    }
}

// otp 
export class invalidOtpException extends Error {
    constructor() {
        super("in-valid OTP", { cause: 409 })
    }
}