const { Client } = require('pg');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
};

export const handler = async (event, context) => {
    try {
        // Get the object from the event
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const fileUri = `s3://${bucket}/${key}`;
        //Save in database (RDS)
        const client = new Client(dbConfig);
        await client.connect();
        //Solo por este ejemplo lo inserto así. Se que es vulnerable por sql_injection. Se solucionaría con un ORM

        const query = 
            `INSERT INTO eventos (costo_entrada, entradas_disponibles, Nombre_evento, flyer) 
            VALUES ($1, $2, $3, $4)`;
        await client.query(query, [0,0, key, fileUri]);
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}.`;
        console.log(message);
        throw new Error(message);
    }
};
