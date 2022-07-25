import joi from "joi";
import date from "@joi/date";

/* CONFERIR O FORMATO DA DATA QUE É ENVIADO PELO REQ.BODY COM O TUTOR */

export function validateCustomerData(req, res, next) {
    const Joi = joi.extend(date);

    const customerSchema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string()
            .regex(/^[0-9]{10,11}$/)
            .required(),
        cpf: Joi.string()
            .regex(/^[0-9]{11}$/)
            .required(),
        birthday: Joi.date().format("YYYY-MM-DD").utc().required(),
    });

    const { error } = customerSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    res.locals.customerData = req.body;

    next();
}
