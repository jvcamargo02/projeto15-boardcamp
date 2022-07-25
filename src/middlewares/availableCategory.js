import { connection as clientDB } from "../database/postgresClient.js";

export async function availableCategory(req, res, next) {
    const { name } = res.locals.category;

    try {
        const { rows: availableCategoryName } = await clientDB.query(
            `SELECT * FROM categories WHERE name = $1`, [name]
        );

        if (availableCategoryName.length !== 0) {
            return res.status(409).send("This category is already registered");
        }

        next();
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}
