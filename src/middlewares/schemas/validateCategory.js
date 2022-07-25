import joi from "joi";

export function validateCategory(req, res, next) {
    const categorySchema = joi.object({
        name: joi.string().required(),
    });

    const { error } = categorySchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    res.locals.category = req.body;

    next();
}
