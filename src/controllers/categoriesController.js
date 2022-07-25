import { connection as clientDB } from "../database/postgresClient.js";

async function getCategories(req, res) {
    try {
        const { rows: categoriesList } = await clientDB.query(
            `SELECT * FROM categories`
        );

        res.status(200).send(categoriesList);
    } catch {
        res.status(500).send("Error querying database");
    }
}

async function postCategories(req, res) {
    const { name } = req.body;

    try {
        await clientDB.query(`INSERT INTO categories (name) VALUES ($1)`, [
            name,
        ]);

        res.sendStatus(201)
    } catch {
        res.status(500).send("Error inserting into database");
    }
}

export { getCategories, postCategories };
