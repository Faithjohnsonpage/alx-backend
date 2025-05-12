import express from 'express';
import { createClient } from 'redis';

const app = express();
const port = 1245;

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 },
];

const client = createClient();

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err);
});

client.on('ready', () => {
  console.log('Redis client connected to the server');
});


function getItemById(id) {
  id = Number(id);
  for (const product of listProducts) {
    if (id === product.itemId) {
      return product;
    }
  }
  return null;
}


async function reserveStockById(itemId, stock) {
  await client.set(`item.${itemId}`, stock);
}


async function getCurrentReservedStockById(itemId) {
  const stock = await client.get(`item.${itemId}`);
  return stock;
}


async function startServer() {
  try {
    await client.connect();
    
    app.get('/list_products', (req, res) => {
      res.json(listProducts);
    });
    
    
    app.get('/list_products/:itemId', async (req, res) => {
      const itemId = Number(req.params.itemId);
      const item = getItemById(itemId);
      
      if (!item) {
        return res.json({ status: 'Product not found' });
      }
      
      // Get current stock or use initial quantity if not set
      const currentStock = await getCurrentReservedStockById(itemId);
      const stock = currentStock !== null ? currentStock : item.initialAvailableQuantity;
      
      // Return product with current quantity
      const result = { ...item, currentQuantity: Number(stock) };
      res.json(result);
    });
    
    app.get('/reserve_product/:itemId', async (req, res) => {
      const itemId = Number(req.params.itemId);
      const item = getItemById(itemId);
      
      if (!item) {
        return res.json({ status: 'Product not found' });
      }
      
      // Get current stock or use initial quantity if not set
      const currentStock = await getCurrentReservedStockById(itemId);
      let stock = currentStock !== null ? Number(currentStock) : item.initialAvailableQuantity;
      
      // Check if enough stock is available
      if (stock <= 0) {
        return res.json({ status: 'Not enough stock available', itemId });
      }
      
      // Reserve one item by decreasing stock
      stock -= 1;
      await reserveStockById(itemId, stock);
      
      // Return confirmation
      return res.json({ status: 'Reservation confirmed', itemId });
    });
    
    app.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
