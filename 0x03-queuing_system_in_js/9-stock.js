const express = require('express');
const { promisify } = require('util');
const { createClient } = require('redis');

const app = express();
const port = 1245;

// Create and configure Redis client
const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Promisify the 'get' method of the Redis client
const getAsync = promisify(client.get).bind(client);

// Define the list of products
const listProducts = [
  { 'itemId': 1, 'itemName': 'Suitcase 250', 'price': 50, 'initialAvailableQuantity': 4 },
  { 'itemId': 2, 'itemName': 'Suitcase 450', 'price': 100, 'initialAvailableQuantity': 10 },
  { 'itemId': 3, 'itemName': 'Suitcase 650', 'price': 350, 'initialAvailableQuantity': 2 },
  { 'itemId': 4, 'itemName': 'Suitcase 1050', 'price': 550, 'initialAvailableQuantity': 5 }
];

// Function to get an item by ID
function getItemById(id) {
  return listProducts.find(product => product.itemId === id);
}

// Function to reserve stock by item ID
function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

// Async function to get current reserved stock by item ID
async function getCurrentReservedStockById(itemId) {
  try {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock, 10) : 0;
  } catch (err) {
    console.error('Error fetching value:', err);
    return 0;
  }
}


// Route to get all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});


// Route to get product details by ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);
  
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = product.initialAvailableQuantity - reservedStock;

  res.json({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
    currentQuantity: currentQuantity
  });
});


// Route to reserve a product by ID
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  // Get the reserved stock from Redis, defaulting to 0 if not found
  const reservedStock = parseInt(await getCurrentReservedStockById(itemId)) || 0;
  const currentQuantity = product.initialAvailableQuantity - reservedStock;

  if (currentQuantity <= 0) {
    return res.json({ status: 'Not enough stock available', itemId: itemId });
  }

  // Reserve stock by incrementing the reserved stock in Redis
  reserveStockById(itemId, reservedStock + 1);

  res.json({ status: 'Reservation confirmed', itemId: itemId });
});


// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
