import { connection as clientDB } from "../database/postgresClient.js";

export async function availableCpf(req, res, next) {
    const { cpf } = res.locals.customerData;

    try {
        const { rows: isUser } = await clientDB.query(
            `SELECT * FROM customers WHERE cpf = '${cpf}'`
        );

        if (isUser.length !== 0) {
            return res.status(409).send("This cpf is already customer");
        }

        next();
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}
