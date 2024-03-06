import { Router } from 'express';
import productModel from '../models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    console.log('Entró al endpoint /products');
    const { page = 1, limit = 10, sort, query = '' } = req.query;

    const totalProducts = await productModel.countDocuments();
    console.log('Total de productos:', totalProducts);
    const totalPages = Math.ceil(totalProducts / limit);

    if (isNaN(page) || page < 1 || page > totalPages) {
      console.log('Error de paginación');
      return res.status(400).json({ error: 'La página solicitada no es válida.' });
    }

    const validSortValues = ['asc', 'desc'];
    const sortOption = validSortValues.includes(sort?.toLowerCase()) ? { price: sort.toLowerCase() } : undefined;

    if (sort && !validSortValues.includes(sort)) {
      console.log('Error en la clasificación');
      return res.status(400).json({ error: 'El valor de sort debe ser "asc" o "desc".' });
    }

    const categoryExists = await productModel.findOne({ category: query }, { _id: 1 }) !== null;
    const categoryOption = query ? { category: query } : {};

    if (query && !categoryExists) {
      console.log('Error en la categoría');
      return res.status(400).json({ error: 'La categoría especificada no es válida.' });
    }

    console.log('sortOption:', sortOption);
    console.log('categoryExists:', categoryExists);
    console.log('categoryOption:', categoryOption);

    const mongoQuery = productModel.find(categoryOption).lean();
    console.log('MongoDB Query:', mongoQuery.getFilter());

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10) || 10,
      sort: sortOption,
      lean: true,
    };

    //Por algún motivo no pude hacer la lógica para el manejo por categoría dentro de options. Agradecería tu orientación :)
    const queryOptions = query ? { category: query } : {};
    const result = await productModel.paginate(queryOptions, options);

    // Recuerda completar el formato de respuesta cuando estes creando las vistas!
    res.status(200).json({ message: 'Productos obtenidos correctamente', data: result });

  } catch (error) {
    console.error('Error al obtener productos', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, staus, stock, category, thumbnails } = req.body;

    const newProduct = new productModel({
      title,
      description,
      code,
      price,
      staus,
      stock,
      category,
      thumbnails,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Producto creado correctamente', data: savedProduct });

  } catch (error) {
    console.error('Error al agregar producto', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto actualizado correctamente', data: updatedProduct });

  } catch (error) {
    console.error('Error al actualizar producto', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente', data: deletedProduct });

  } catch (error) {
    console.error('Error al eliminar producto', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

export default router;