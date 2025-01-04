import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();

connectDB(); // Connecct to MongoDB

const app = express();

//const port =process.env.PORT

app.get('/', (req, res) => {
  res.send('API is running...');

});

export default app;

//app.listen(port, () => console.log(`Server running on port ${port}`));
