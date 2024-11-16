const AWS = require("aws-sdk");
const { validateCreditCard } = require("./creditCardValidator");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "EventosEntradas"; // Cambia por el nombre de tu tabla en DynamoDB

exports.handler = async (event) => {
    try {
        const { cardNumber, userId, entryId } = JSON.parse(event.body);

        // Paso 1: Validar la tarjeta de crédito
        const cardType = validateCreditCard(cardNumber);
        console.log(`Tipo de tarjeta: ${cardType}`);

        // Paso 2: Chequear y disminuir las entradas disponibles
        const params = {
            TableName: TABLE_NAME,
            Key: { entryId },
            UpdateExpression: `
                SET entradasDisponibles = entradasDisponibles - :decrement,
                    usuariosEjecutores = list_append(if_not_exists(usuariosEjecutores, :emptyList), :userId)
            `,
            ConditionExpression: `
                attribute_exists(entradasDisponibles) AND
                entradasDisponibles > :zero AND
                NOT contains(usuariosEjecutores, :userId)
            `,
            ExpressionAttributeValues: {
                ":decrement": 1,
                ":zero": 0,
                ":userId": [userId],
                ":emptyList": [],
            },
            ReturnValues: "UPDATED_NEW",
        };

        const dynamoResult = await dynamoDB.update(params).promise();
        console.log("DynamoDB resultado ejecucion: ", dynamoResult);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Entrada decrementada exitosamente.",
                cardType,
            }),
        };
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
