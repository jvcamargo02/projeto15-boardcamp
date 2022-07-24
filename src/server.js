import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connection as clientDB } from "./database/postgresClient.js";
import customersRoute from "./routes/customersRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(customersRoute);

app.get("/", async (req, res) => {
    await clientDB.query(
        `INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ('João Camargo', '21998899222', '01234567890', '1992-10-05')`
    );

    /*     console.log(query.rows) */

    res.send("OK");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor is running on port ${PORT}`));
