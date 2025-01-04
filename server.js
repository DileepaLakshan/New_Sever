import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
dotenv.config();

connectDB(); // Connecct to MongoDB

const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Cookie parser middleware
app.use(cookieParser());

//const port =process.env.PORT

app.get('/', (req, res) => {
  res.send('API is running...');

});

app.use('/api/users', userRoutes);

export default app;

//app.listen(port, () => console.log(`Server running on port ${port}`));
