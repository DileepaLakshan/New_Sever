import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
dotenv.config();

connectDB(); // Connecct to MongoDB

const app = express();


//Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//Cookie parser middleware
app.use(cookieParser());

const port =process.env.PORT

app.get('/', (req, res) => {
  res.send('API is running...');

});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

app.listen(port, () => console.log(`Server running on port ${port}`));
