const fs = require('fs');
const cartsDataFile = './data/carts.json';
const productsDataFile = './data/products.json';

class CartManager {
    constructor() {
        this.carts = [];
        this.products = [];
        this.loadData();
    }

    loadData() {
        try {
            const cartsData = fs.readFileSync(cartsDataFile, 'utf8');
            this.carts = JSON.parse(cartsData);
        } catch (error) {
            console.error('Error al cargar los carritos:', error);
            this.carts = [];
        }

        try {
            const productsData = fs.readFileSync(productsDataFile, 'utf8');
            this.products = JSON.parse(productsData);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            this.products = [];
        }
    }

    saveData() {
        try {
            fs.writeFileSync(cartsDataFile, JSON.stringify(this.carts), 'utf8');
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
        }
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    addCart() {
        const newCart = { id: this.carts.length + 1, products: [] };
        this.carts.push(newCart);
        this.saveData();
        return newCart;
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (cart) {
            const productInCart = cart.products.find(item => item.id === productId);
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ id: productId, quantity });
            }
            this.saveData();
        }
        return cart;
    }
}

module.exports = new CartManager();
