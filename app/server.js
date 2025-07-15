const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig');

app.use(cors()); 
app.use(express.json());

// Route API
app.use('/api/users', userRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Trang mặc định
app.get('/', (req, res) => {
  res.send('Workprise API is running');
});

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📘 Swagger docs at http://localhost:${PORT}/api-docs`);
});
