import express from 'express';
import mongoose from 'mongoose';
import exphbs from 'express-handlebars';
import productsRouter from './src/routes/products.js';
import cartRouter from './src/routes/carts.js';

const app = express();
app.use(express.json());

//app.engine('handlebars', exphbs.engine({
    //layoutsDir: __dirname + '/src/views/layouts',
//}));
//app.set('view engine', 'handlebars');

//Deshabilitación temporal de handlebars. Recuerda reHabilitar!
app.set('views', false);
app.set('view engine', false);

// Conexión temporal a base de datos locales.
const connectionString = 'mongodb://127.0.0.1:27017/semillero-gorrion';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Conectado a la base de datos.");
        const dbName = 'semillero-gorrion';
        const db = mongoose.connection.useDb(dbName);
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos.", error);
    });

app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    next();
});

app.use('/products', productsRouter);
app.use('/carts', cartRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});