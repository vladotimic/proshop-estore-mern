import 'colors';
import 'express-async-errors';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productsRouter from './routes/productRoutes.js';
import { notFound, errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productsRouter);

app.use(notFound);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
      .bold
  );
});
