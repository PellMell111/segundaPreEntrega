const productManager = require('../managers/productManager');

const getProducts = (req, res) => {
    const products = productManager.getProducts();
    if (products.length === 0) {
        return res.status(404).json({ status: 'error', message: 'No hay productos disponibles.' });
    }
    res.json(products);
};

const getProductById = (req, res) => {
    const { pid } = req.params;
    const product = productManager.getProductById(Number(pid));
    if (!product) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
    }
    res.json(product);
};

const addProduct = (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son requeridos.' });
    }
    const newProduct = { title, description, code, price, stock, category, thumbnails: thumbnails || [] };
    productManager.addProduct(newProduct);
    res.status(201).json({ status: 'success', message: 'Producto agregado con éxito.' });
};

const updateProduct = (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    const product = productManager.updateProduct(Number(pid), updatedProduct);
    if (!product) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
    }
    res.json({ status: 'success', message: 'Producto actualizado con éxito.' });
};

const deleteProduct = (req, res) => {
    const { pid } = req.params;
    const success = productManager.deleteProduct(Number(pid));
    if (!success) {
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
    }
    res.json({ status: 'success', message: 'Producto eliminado con éxito.' });
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
