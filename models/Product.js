const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    float: { type: String, default: "Belirtilmemiş" },
    rarity: { type: String, default: "Bilinmiyor" },
    pattern: { type: String, default: "-" },
    category: { type: String, required: true } // e.g., 'knives', 'gloves'
});

module.exports = mongoose.model('Product', productSchema);
