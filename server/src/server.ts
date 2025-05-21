// src/server.ts
import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
  
   await connectDB();

  console.log(`Server running on http://localhost:${PORT}`);
});
