const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true
    },
    ingredients: [
        {
            inventoryItemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory"
            },
            quantity: Number // quantity required per menu item
        }
    ]
});

module.exports = mongoose.model("Recipe", RecipeSchema);
