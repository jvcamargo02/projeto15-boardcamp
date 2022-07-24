import { connection as clientDB } from "../database/postgresClient.js";

export async function availableCpf(req, res, next) {
    const { cpf } = res.locals.customerData;

    try {
        const { rows: isUser } = await clientDB.query(
            `SELECT * FROM customers WHERE cpf = '${cpf}'`
        );

        isUser.length === 0
            ? next()
            : res.status(409).send("This cpf is already customer");
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}
