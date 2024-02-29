import { Router } from 'express';
import productModel from '../models/products.model.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const router = Router();
productModel.plugin(mongoosePaginate);

router.get('/products', async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);
    
        const { page = 1, limit = 10, sort = 'none', query = '' } = req.query;
        const pageNumber = parseInt(page, 10);
    
        if (isNaN(pageNumber) || pageNumber < 1) {
          return res.status(400).json({ error: 'La página debe ser un número entero positivo.' });
        }
    
        if (pageNumber > totalPages) {
          return res.status(400).json({ error: 'La página solicitada no existe.' });
        }
    
        const validSortValues = ['asc', 'desc'];

        if (sort && !validSortValues.includes(sort)) {
          return res.status(400).json({ error: 'El valor de sort debe ser "asc" o "desc".' });
        }

        const categoryExists = await productModel.exists({ category: query });

        if (query && !categoryExists) {
            return res.status(400).json({ error: 'La categoría especificada no es válida.' });
        }

        let pageNumberParam = parseInt(req.query.page);
        if (!pageNumberParam) pageNumberParam = 1;

        const result = await productModel.paginate({}, { page, limit: parseInt(req.query.limit) || 10, lean: true });

        const paginatedProducts = await productModel.paginate({}, options);

        res.status(200).json({ message: 'Productos obtenidos correctamente', data: result });

    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
})