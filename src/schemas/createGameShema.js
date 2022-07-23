import joi from 'joi'

export const createGameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),
    stockTotal: joi.number().required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().required()
})