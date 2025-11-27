const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/cs2skinmarket', {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB Connected for Seeding');

        // Read data from the JSON file in artifacts
        const rawData = fs.readFileSync('/Users/salihyazar/.gemini/antigravity/brain/7ab3df4d-f743-4143-b277-c2889ed12994/products.json', 'utf-8');
        const productsData = JSON.parse(rawData);

        // Clear existing data
        await Product.deleteMany({});
        console.log('Cleared existing products');

        const productsToInsert = [];
        const seenIds = new Set();

        for (const [sectionId, items] of Object.entries(productsData)) {
            const category = sectionId.replace('-content', '');
            
            items.forEach(item => {
                if (!seenIds.has(item.id)) {
                    seenIds.add(item.id);
                    productsToInsert.push({
                        ...item,
                        category: category
                    });
                } else {
                    console.warn(`Skipping duplicate product ID: ${item.id}`);
                }
            });
        }

        await Product.insertMany(productsToInsert);
        console.log(`Seeded ${productsToInsert.length} products`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
