import joi from "joi";

export function validateRentalPost(req, res, next) {
    const rentalSchema = joi.object({
        customerId: joi.number().required(),
        gameId: joi.number().required(),
        daysRented: joi.number().min(1).required(),
    });

    const { error } = rentalSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
}
