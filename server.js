const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require('dotenv').config(); // .env फाइल को load करने के लिए
const adminModel = require('./src/models/AdminModel');

const server = express()

// Enhanced CORS configuration
server.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow Next.js frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

server.use(express.json())
server.use(express.urlencoded({ extended: true }))


server.get("/", (request, response) => {
  response.send("Server Working Fine.....")
})

// backend url
require("./src/routes/backend/UserAdmin.routes")(server)
require('./src/routes/backend/Admin.routes')(server);




// fronted url
require("./src/routes/frontend/UserAuth.routes")(server)


server.get("*", (request, response) => {
  response.send("Page not found.....")
})




const MONGO_URI = 'mongodb+srv://yogeshsainijpr123:Gionee123@cluster0.nbzuobn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // या कोई और database जो आप use करना चाहें


mongoose.connect(MONGO_URI)
  .then(async () => {
    const checkAdmin = await adminModel.find();
    if (checkAdmin.length == 0) {
      let admin = await adminModel({ adminName: 'admin', adminPassword: 'admin123' });
      await admin.save();
    }
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