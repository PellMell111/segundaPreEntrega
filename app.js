const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 8080;

app.engine('handlebars', engine({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const products = require('./data/products.json');
    res.render('home', { products, title: 'Home' });
});

app.get('/realtimeproducts', (req, res) => {
    const products = require('./data/products.json');
    res.render('realTimeProducts', { products, title: 'Productos en Tiempo Real' });
});

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('addProduct', (product) => {
        const productManager = require('./managers/productManager');
        productManager.addProduct(product);
        io.emit('updateProducts', productManager.getProducts());
    });

    socket.on('deleteProduct', (id) => {
        const productManager = require('./managers/productManager');
        productManager.deleteProduct(id);
        io.emit('updateProducts', productManager.getProducts());
    });
});

server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});