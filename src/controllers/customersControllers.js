import { connection as clientDB } from "../database/postgresClient.js";

async function getCustomers(req, res) {
    const queryCpf = req.query.cpf;

    try {
        if (queryCpf) {
            const { rows: customers } = await clientDB.query(
                `SELECT * FROM customers WHERE cpf LIKE '$1%'`,
                [queryCpf]
            );

            console.log(queryCpf)

            return res.status(200).send(customers);
        }

        const { rows: customers } = await clientDB.query(
            `SELECT * FROM customers`
        );
        res.status(200).send(customers);
    } catch {
        res.status(500).send("Error querying database");
    }
}

async function getCustomer(req, res) {
    const customerId = req.params.id;

    try {
        const { rows: customer } = await clientDB.query(
            `SELECT * FROM customers WHERE id = ${customerId}`
        );

        if (customer.length === 0) {
            return res.status(404).send("Customer not found");
        }

        return res.status(200).send(customer);
    } catch {
        res.status(500).send("Error querying database");
    }
}

async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = res.locals.customerData;

    try {
        await clientDB.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday]
        );

        res.sendStatus(201);
    } catch {
        res.status(500).send("Error inserting into database");
    }
}

export { getCustomers, getCustomer, postCustomer };
