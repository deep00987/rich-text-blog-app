const express = require('express');
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
  } = require('./category.controller');
const {body} = require('express-validator')
const { validateRequest } = require('../../../middlewares/req-validation')
const { currentUser } = require('../../../middlewares/curr-user')
const { requireUserAuth } = require('../../../middlewares/require-auth')
const categoryRouter = express.Router();

categoryRouter.post('/add',
    currentUser,
    requireUserAuth,
    [
        body('name').exists().isString().withMessage("category name required"),
    ],
    validateRequest,
    createCategory
);

categoryRouter.get('/all',
    currentUser,
    requireUserAuth,
    getAllCategories,
);

categoryRouter.get('/:id', 
    currentUser,
    requireUserAuth,
    getCategoryById
);

categoryRouter.put('/update/:id',
    currentUser,
    requireUserAuth,
    [
        body('name').exists().isString().withMessage("category name required"),
    ],
    validateRequest,
    updateCategory
);

categoryRouter.delete('/delete/:id', 
    currentUser,
    requireUserAuth,    
    deleteCategory
);

module.exports = { categoryRouter };
