import dayjs from "dayjs";
import { connection as clientDB } from "../database/postgresClient.js";

async function getRentals(req, res) {
    const { customerId } = req.query;
    const { gameId } = req.query;

    try {
        if (gameId && customerId) {
            const { rows: rentalsList } = await clientDB.query(
                `SELECT r.*, json_build_object('id', c.id, 'name', c.name) as customer, json_build_object('id', g.id, 'name', g.name, 'categoryId', g."categoryId", 'categoryName', categories.name) as game FROM rentals r JOIN customers c ON r."customerId" = c.id JOIN games g ON r."gameId" = g.id JOIN categories ON g."categoryId" = categories.id WHERE r."customerId" = $1 AND r."gameId" = $2
        `,
                [customerId, gameId]
            );

            return res.status(200).send(rentalsList);
        }

        if (customerId) {
            const { rows: rentalsList } = await clientDB.query(
                `SELECT r.*, json_build_object('id', c.id, 'name', c.name) as customer, json_build_object('id', g.id, 'name', g.name, 'categoryId', g."categoryId", 'categoryName', categories.name) as game FROM rentals r JOIN customers c ON r."customerId" = c.id JOIN games g ON r."gameId" = g.id JOIN categories ON g."categoryId" = categories.id WHERE r."customerId" = $1
        `,
                [customerId]
            );

            return res.status(200).send(rentalsList);
        }

        if (gameId) {
            const { rows: rentalsList } = await clientDB.query(
                `SELECT r.*, json_build_object('id', c.id, 'name', c.name) as customer, json_build_object('id', g.id, 'name', g.name, 'categoryId', g."categoryId", 'categoryName', categories.name) as game FROM rentals r JOIN customers c ON r."customerId" = c.id JOIN games g ON r."gameId" = g.id JOIN categories ON g."categoryId" = categories.id WHERE r."gameId" = $1
        `,
                [gameId]
            );

            return res.status(200).send(rentalsList);
        }

        const { rows: rentalsList } =
            await clientDB.query(`SELECT r.*, json_build_object('id', c.id, 'name', c.name) as customer, json_build_object('id', g.id, 'name', g.name, 'categoryId', g."categoryId", 'categoryName', categories.name) as game FROM rentals r JOIN customers c ON r."customerId" = c.id JOIN games g ON r."gameId" = g.id JOIN categories ON g."categoryId" = categories.id
        `);

        res.status(200).send(rentalsList);
    } catch {
        res.status(500).send("Error querying database");
    }
}

async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const pricePerDay = res.locals.pricePerDay;
    const reqTime = dayjs().locale("pt-br").format("YYYY-MM-DD");
    const originalPrice = daysRented * pricePerDay;

    try {
        await clientDB.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1,$2,$3,$4,null,$5, null)`,
            [customerId, gameId, reqTime, daysRented, originalPrice]
        );

        res.sendStatus(201);
    } catch {
        res.status(500).send("Error inserting into database");
    }
}

async function postReturn(req, res) {
    const { id } = req.params
    const { rental } = res.locals;
    const pricePerDay = res.locals.pricePerDay
    let delayFee = 0
    const reqTime = dayjs().locale("pt-br").format("YYYY-MM-DD");
    const diff = dayjs(reqTime).diff(rental.rentDate, "day");

    if(rental.returnDate !== null ){
        return res.status(404).send("This rental has already ended")
    }

    if(diff > rental.daysRented){
        delayFee = (diff-rental.daysRented)*pricePerDay
    }

    try{
        await clientDB.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [reqTime, delayFee, id])

        res.status(200).send()
    }catch{
        res.status(500).send("Error inserting into database");
    }

}

async function deleteRent (req, res) {
    const { rental } = res.locals

    if(rental.returnDate === null ){
        return res.status(404).send("This rental isn't ended")
    }
    
    try{
        await clientDB.query(`
        DELETE FROM rentals WHERE id = $1;
        `, [rental.id])
    } catch{
        res.status(500).send("Error inserting into database");
    }

}

export { getRentals, postRentals, postReturn, deleteRent };
