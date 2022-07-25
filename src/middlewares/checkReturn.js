import { connection as clientDB } from "../database/postgresClient.js";

export async function checkReturn (req, res, next) {
    const { id } = req.params

    try{
        const {rows: rental} = await clientDB.query(`
            SELECT * FROM rentals WHERE id = $1
        `, [id])
        
        if(rental.length !== 1 ){
            return res.status(404).send("This rental isn't registered")
        }

        if(rental[0].returnDate !== null ){
            return res.status(404).send("this rental has already ended")
        }

        res.locals.rental = rental[0]

        next()

    }catch{
        res.status(500).send("An error occurred. Please try again later.");
    }
}