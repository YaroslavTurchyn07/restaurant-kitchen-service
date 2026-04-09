require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./models');

const authRoutes = require('./routes/auth');
const cookRoutes = require('./routes/cooks');
const dishRoutes = require('./routes/dishes');
const dishTypeRoutes = require('./routes/dishTypes');
const ingredientRoutes = require('./routes/ingredients');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cooks', cookRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/dish-types', dishTypeRoutes);
app.use('/api/ingredients', ingredientRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

syncDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
