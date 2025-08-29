const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/mongodb/Product');

const sampleProducts = [
  {
    name: 'MacBook Pro 16"',
    price: 2399.99,
    category: 'Electronics',
    stock: 8,
    description: 'Powerful laptop for professionals and creatives',
    tags: ['laptop', 'apple', 'professional']
  },
  {
    name: 'iPhone 14 Pro',
    price: 999.99,
    category: 'Electronics',
    stock: 25,
    description: 'Latest iPhone with advanced camera system',
    tags: ['smartphone', 'apple', 'mobile']
  },
  {
    name: 'Ergonomic Office Chair',
    price: 299.99,
    category: 'Home',
    stock: 3,
    description: 'Comfortable chair for long work hours',
    tags: ['furniture', 'office', 'comfort']
  },
  {
    name: 'JavaScript: The Good Parts',
    price: 29.99,
    category: 'Books',
    stock: 15,
    description: 'Classic book on JavaScript programming',
    tags: ['programming', 'javascript', 'book']
  },
  {
    name: 'Wireless Headphones',
    price: 149.99,
    category: 'Electronics',
    stock: 0,
    description: 'Noise-cancelling wireless headphones',
    tags: ['audio', 'wireless', 'music']
  }
];

const initMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample data
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted');
    
    // Create text index
    await Product.createIndexes();
    console.log('Text index created');
    
    mongoose.connection.close();
    console.log('MongoDB Atlas connection closed');
  } catch (error) {
    console.error('Error initializing MongoDB Atlas:', error);
    process.exit(1);
  }
};

initMongoDB();