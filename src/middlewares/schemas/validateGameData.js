import joi from "joi"

export function validateGameData (req, res, next){

    const gameSchema = joi.object({

        name: joi.string().required(),
        image: joi.string().uri().required(),
        stockTotal: joi.number().min(0).required(),
        categoryId: joi.number().required(),
        pricePerDay: joi.number().min(0).required()
    })

    const { error } = gameSchema.validate(req.body)

    if(error){
        return res.status(400).send(error.details[0].message);
    }

    next()
}
