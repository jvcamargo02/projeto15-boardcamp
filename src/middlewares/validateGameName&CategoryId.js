import { connection as clientDB } from "../database/postgresClient.js";

async function validateCategoryId(req, res, next) {
    const { categoryId: id } = req.body;

    try {
        const { rows: existingId } = await clientDB.query(
            `SELECT * FROM categories WHERE id = $1`,
            [id]
        );

        if (existingId.length === 0) {
            return res.status(400).send("This categoryId isn't registered");
        }

        next();
    } catch {
        res.status(500).send("An error occurred. Please try again later.");
    }
}

async function availableGameName(req, res, next) {
    const { name } = req.body;
    
    try{
        const { rows: availableName } = await clientDB.query(`SELECT * FROM games WHERE name = $1`, [name])

        if(availableName.length !== 0 ){
            return res.status(409).send("This game is already registered");
        }

        next()
    }catch{
        res.status(500).send("An error occurred. Please try again later.");
    }
}



export { validateCategoryId, availableGameName };
