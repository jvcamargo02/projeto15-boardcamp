import { connection as clientDB } from "../database/postgresClient.js";

async function getRentals(req, res) {
    try {
        await clientDB.query(`SELECT * FROM rentals`);

        res.send(200);
    } catch {
        /* RETORNO EM BREVE */
    }
}

export {};
