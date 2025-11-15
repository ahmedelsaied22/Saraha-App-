
export const validation = (schema) => {
    return (req, res, next) => {

        const result = schema.validate(req.body, { abortEarly: false })
        // console.log({ result });

        if (result.error) {
            throw new Error(result.error, { cause: 400 })
        }
        next()
    }
}