import { Router } from 'express';
import cartModel from '../models/carts.model.js';
import productModel from '../models/products.model.js';

const router = Router();

router.post('/new-cart', async (req, res) => {
    try {
        console.log('Entró al endpoint /new-cart');
    
        const newCart = new cartModel();
        const savedCart = await newCart.save();
  
        res.status(201).json({ message: 'Carrito creado correctamente', data: savedCart });
    } catch (error) {
        console.error('Error al crear el carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
  
        const updatedCart = await cartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: pid } },
            { new: true }
        ).populate('products');
    
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
  
        res.status(200).json({ message: 'Producto eliminado del carrito correctamente', data: updatedCart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedProducts = req.body.products;
    
        const updatedCart = await cartModel.findByIdAndUpdate(cid, { products: updatedProducts }, { new: true }).populate('products');
    
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
    
        res.status(200).json({ message: 'Carrito actualizado correctamente', data: updatedCart });
  
    } catch (error) {
        console.error('Error al actualizar carrito', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
  
      if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: 'La cantidad debe ser un número positivo.' });
      }
  
      const updatedCart = await cartModel.findOneAndUpdate(
        { _id: cid, 'products._id': pid },
        { $set: { 'products.$.quantity': quantity } },
        { new: true }
      ).populate('products');
  
      if (!updatedCart) {
        return res.status(404).json({ error: 'Carrito o producto no encontrado.' });
      }
  
      res.status(200).json({ message: 'Cantidad de producto actualizada correctamente', data: updatedCart.products });
    } catch (error) {
      console.error('Error al actualizar cantidad ', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});
  
export default router;