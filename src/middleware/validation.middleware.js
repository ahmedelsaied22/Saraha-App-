
export const validation = (schema) => {
    return (req, res, next) => {

        const data = {
            ...req.file,
            ...req.body,
            ...req.params,
            ...req.query
        }
        const result = schema.validate(data, { abortEarly: false })

        if (result.error) {
            throw new Error(result.error, { cause: 400 })

        }
        next()
    }
}