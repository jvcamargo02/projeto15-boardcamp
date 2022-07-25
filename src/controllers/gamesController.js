import { connection as clientDB } from "../database/postgresClient.js";

async function getGames(req, res) {
    const queryGameName = req.query.name;

    try {
        if (queryGameName) {
            const { rows: gamesList } = await clientDB.query(
                `SELECT games.*, c.name as "categoryName" FROM games JOIN categories c ON "categoryId" = c.id WHERE games.name ILIKE '${queryGameName}%'`
            );

            return res.status(200).send(gamesList);
        }

        const { rows: gamesList } = await clientDB.query(
            `SELECT games.*, c.name as "categoryName" FROM games JOIN categories c ON "categoryId" = c.id`
        );

        res.status(200).send(gamesList);
    } catch {
        res.status(500).send("Error querying database");
    }
}

async function postGames(req, res) {
    const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
    console.log(stockTotal)
    try {
        await clientDB.query(
            `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
            [name, image, stockTotal, categoryId, pricePerDay]
        );

        res.sendStatus(201)
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}

export { getGames, postGames };
