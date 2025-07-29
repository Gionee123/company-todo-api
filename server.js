const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require('dotenv').config(); // .env फाइल को load करने के लिए

const server = express()
server.use(cors())
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use('/uploads/Images', express.static('uploads/Images'));


server.get("/", (request, response) => {
  response.send("Server Working Fine.....")
})

// backend url



// fronted url
require("./src/routes/frontend/profile.routes")(server)



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