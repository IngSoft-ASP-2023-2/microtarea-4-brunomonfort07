//FUNCTION NAME: validate-card-and-lambda

/*2. La segunda, es accesible vía api gateway (método POST) que gestiona la venta de un espectáculo. 

Para ello, con una capa debe verificar la validez de la tarjeta de crédito de entrada (visa y master)
y disminuir la cantidad de entradas disponibles. Además, para evitar el caso borde de ejecuciones no 
deseadas, en dynamo se debe implementar el conditional writing - que chequea si la instancia de la 
función lambda ya fue ejecutada.*/

import dotenv from 'dotenv';
import pg from 'pg';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const { Client } = pg;

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: { rejectUnauthorized: false }
};

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });

const validateCreditCard = (cardNumber) => {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const masterRegex = /^5[1-5][0-9]{14}$/;

    if (visaRegex.test(cardNumber)) {
        return "VISA";
    } else if (masterRegex.test(cardNumber)) {
        return "MASTERCARD";
    }
    throw new Error("Invalid credit card number.");
};

const saveDynamo = async (lambdaId, body) => {
    const params = {
        TableName: "lambdaexecutions",
        Item: {
            lambdaId: { S: lambdaId },
            body: { S: body },
            timestamp: { S: new Date().toISOString() },
        }
    };
    //Parametrizo el Conditional Writing
    if (process.env.CONDITIONAL_WRITING_ENABLED === "true")
        params.ConditionExpression = "attribute_not_exists(lambdaId)";

    try {
        return await dynamoClient.send(new PutItemCommand(params));
    } catch (error) {
        if (error.name === "ConditionalCheckFailedException") {
            throw new Error(`El lambda con ID '${messageId}' ya existe en la tabla.`);
        } else {
            console.error("Error al guardar el mensaje:", error);
            throw error;
        }
    }
}


export const handler = async (event, context) => {
    try {
        console.log("BRUNO. Body = " + event.body);

        const { cardNumber, eventId } = JSON.parse(event.body);

        const lambdaInstanceId = process.env.AWS_LAMBDA_LOG_STREAM_NAME;
        console.log(`BRUNO. Lambda Instance ID: ${lambdaInstanceId}`);

        if (!cardNumber)
            throw new Error("ERROR: cardNumber es inválido!");
        if (!eventId)
            throw new Error("ERROR: eventId es inválido!");

        const cardType = validateCreditCard(cardNumber);
        console.log(`BRUNO. Tipo de tarjeta: ${cardType}`);

        //Save in DynamoDB
        saveDynamo(lambdaInstanceId, event.body);

        //Update in database (RDS)
        const client = new Client(dbConfig);
        await client.connect();
        //Solo por este ejemplo lo modifico así. Se que es vulnerable por sql_injection. 
        //Se solucionaría con un ORM
        //PENDIENTE: Validacion entradas_disponibles > 0
        const query =
            `UPDATE eventos 
            SET entradas_disponibles = entradas_disponibles - 1
            WHERE ID = $1`;
        await client.query(query, [eventId]);
        await client.end();

        const response = {
            statusCode: 200,
            body: JSON.stringify('OK!'),
        };
        return response;
    } catch (err) {
        console.log(err);
        const message = `ERROR Processing card. ${JSON.stringify(err)}`;
        console.log(message);
        throw new Error(message);
    }
};


