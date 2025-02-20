import express from 'express';
//import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
//import cartRoutes from './routes/productRoutes.js';
import paymentRoutes  from './routes/paymentRouters.js';
import cors from 'cors';

dotenv.config();

connectDB(); // Connecct to MongoDB

const app = express();

app.use(cors({
  origin: ['https://funiture-site-1-git-main-neshadis-projects.vercel.app', 'http://localhost:5173'],// Allow specific origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow cookies if needed
}))


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
app.use('/api/cart', cartRoutes);
app.use('/api/payments',paymentRoutes);
app.use(notFound);
app.use(errorHandler);

//payment


export default app;

app.listen(port, () => console.log(`Server running on port ${port}`));
