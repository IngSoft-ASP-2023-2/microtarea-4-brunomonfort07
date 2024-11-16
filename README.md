[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/LmyA7_0U)
# microtarea-4-aws-lambda

Ud está construyendo una app para la venta de tickets a eventos deportivos y espectáculos musicales (una ticketera), en ese sentido quiere comenzar con un MVP que le genere el menor gasto posible.

Para ello, debe implementar 2 funciones lambda en aws.
1. La primera, escucha la inserción de un objeto en un bucket que son los flyers (imágenes) de los eventos y los inserta en una base de datos RDS (asumir que el evento ya existe y el nombre del archivo es el nombre del mismo).
2. La segunda, es accesible vía api gateway (método POST) que gestiona la venta de un espectáculo. Para ello, con una capa debe verificar la validez de la tarjeta de crédito de entrada (visa y master) y disminuir la cantidad de entradas disponibles. Además, para evitar el caso borde de ejecuciones no deseadas, en dynamo se debe implementar el conditional writing - que chequea si la instancia de la función lambda ya fue ejecutada.

## Notas
La BD solo cuenta con una tabla: Nombre evento, costo entrada, entradas disponibles, flyer (img mapeada a un string).

# Micro Tarea: API para para la venta de tickets (usando Lambdas) - Bruno Monfort 173280

## Detalles del proyecto
Lenguaje de programación: Javascript

## Iniciacion del proyecto en local
1. Clonar el repositorio
2. Iniciar el proyecto con el comando `npm init -y`
3. Crear un archivo index.js.
3. Instalar las dependencias con el comando `npm install`
4. Crear un archivo .env con las variables de entorno necesarias para la conexión con AWS SQS

## Generación de la BD en AWS RDS y la tabla para los eventos

CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    costo_entrada INTEGER NOT NULL,
    entradas_disponibles INTEGER NOT NULL,
    Nombre_evento TEXT NOT NULL,
    flyer TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

## Generación de las funciones lambda en AWS Lambda

## Archivo .ENV

Por seguridad, los links compartidos solo son visibles por usuarios de la universidad (ejemplo@fi365.ort.edu.uy).

Archivo Env: TODO LINK MI SHAREPOINT

# Referencias utilizadas para la realización del proyecto

https://docs.aws.amazon.com/lambda/latest/dg/lambda-event-driven-paradigm.html
https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html

https://docs.aws.amazon.com/lambda/latest/dg/packaging-layers.html
