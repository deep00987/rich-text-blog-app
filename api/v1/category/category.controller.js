const Category = require('./category.model');
const { BadRequestError } = require('../../../error-types/bad-req-err')

// Create a new category
const createCategory = async (req, res) => {
    const { name } = req.body;
    const categoryExists = await Category.findOne({name})

    if (categoryExists){
        throw new BadRequestError("category already exists")
    }

  try {

    // Create a new category
    const category = new Category({
      name
    });

    await category.save();

    return res.status(201).json({ message: 'Category created successfully' });
  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });

    }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Find the category by ID
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update the category
    category.name = name;

    // Save the updated category to the database
    await category.save();

    return res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category by ID and remove it
    const deletedCategory = await Category.findByIdAndRemove(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
