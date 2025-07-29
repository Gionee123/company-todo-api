const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require('dotenv').config(); // .env फाइल को load करने के लिए

const server = express()


const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://ipage-api.onrender.com',
    'http://localhost:3000',
    'http://localhost:8080',
    'https://your-frontend-domain.com' // Add your frontend domain if different
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};
server.use(cors(corsOptions));

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use('/uploads/Images', express.static('uploads/Images'));


server.get("/", (request, response) => {
  response.send("Server Working Fine.....")
})

// backend url



// fronted url
try {
  require("./src/routes/frontend/profile.routes")(server);
  console.log('✅ Frontend routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading frontend routes:', error);
}

// Add a test route to verify the API is working
server.get("/api/test", (request, response) => {
  response.json({
    status: true,
    message: "API is working correctly",
    timestamp: new Date().toISOString()
  });
});


server.get("*", (request, response) => {
  response.send("Page not found.....")
})




const MONGO_URI = 'mongodb+srv://yogeshsainijpr123:Gionee123@cluster0.nbzuobn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // या कोई और database जो आप use करना चाहें


mongoose.connect(MONGO_URI)
  .then(() => {

    console.log('✅ Local Database Connected Successfully');

    const PORT = 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Local DB Connection Failed:', err.message);
    process.exit(1);
  });