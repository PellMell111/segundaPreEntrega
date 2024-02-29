const express = require('express');
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');

const app = express();
app.use(express.json());

app.engine('handlebars', exphbs.engine({
    layoutsDir: __dirname + '/src/views/layouts',
}));
app.set('view engine', 'handlebars');

mongoose.connect('mongodb+srv://devTemp:LS6tSEiiSMAgvEye@cluster0.nsgdrhn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log("Conectado a la base de datos.");
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos.", error);
    })

app.get('/products', (req, res) => {
    res.render('productos');
});

app.get('/carts/:cid', (req, res) => {
    res.render('carrito');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});