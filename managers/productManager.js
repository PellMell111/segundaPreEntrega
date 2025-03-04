const fs = require('fs');
const productsDataFile = './data/products.json';

class ProductManager {
    constructor() {
        this.products = [];
        this.loadData();
    }

    loadData() {
        try {
            const data = fs.readFileSync(productsDataFile, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            this.products = [];
        }
    }

    saveData() {
        try {
            fs.writeFileSync(productsDataFile, JSON.stringify(this.products), 'utf8');
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    addProduct(product) {
        product.id = this.products.length + 1;
        this.products.push(product);
        this.saveData();
    }

    updateProduct(id, updatedProduct) {
        const product = this.getProductById(id);
        if (product) {
            Object.assign(product, updatedProduct);
            this.saveData();
        }
        return product;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveData();
        }
        return index !== -1;
    }
}

module.exports = new ProductManager();