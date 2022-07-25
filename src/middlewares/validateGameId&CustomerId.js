import { connection as clientDB } from "../database/postgresClient.js";

export async function existingCustomerId(req, res, next) {
    const { customerId } = req.body;

    try {
        const { rows: existingUser } = await clientDB.query(
            `
            SELECT * FROM customers WHERE id = $1
        `,
            [customerId]
        );

        if (existingUser.length !== 1) {
            return res.status(400).send("This costumerId isn't registered");
        }

        next();
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}

export async function existingGameId(req, res, next) {
    const gameId = req.body.gameId || res.locals.rental.gameId

    try {
        const { rows: existingGame } = await clientDB.query(
            `
            SELECT * FROM games WHERE id = $1
        `,
            [gameId]
        );

        if (existingGame.length !== 1) {
            return res.status(400).send("This game isn't registered");
        }

        res.locals.pricePerDay = existingGame[0].pricePerDay;

        next();
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}

export async function checkAvailability(req, res, next) {
    const { gameId } = req.body;

    try {
        const { rows: availability } = await clientDB.query(
            `SELECT COUNT(rentals."gameId"), g."stockTotal" FROM rentals JOIN games g ON "gameId" = g.id WHERE "gameId" = $1 GROUP BY (g."stockTotal")`,
            [gameId]
        );

        if (availability[0].count >= availability[0].stockTotal) {
            return res.status(400).send("Out of stock");
        }

        next();
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}
