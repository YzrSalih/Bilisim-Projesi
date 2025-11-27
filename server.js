const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/cs2skinmarket')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        
        // Group by category to match frontend structure
        const groupedProducts = {};
        products.forEach(product => {
            const categoryKey = product.category + '-content';
            if (!groupedProducts[categoryKey]) {
                groupedProducts[categoryKey] = [];
            }
            groupedProducts[categoryKey].push(product);
        });

        res.json(groupedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
