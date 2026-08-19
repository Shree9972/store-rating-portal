const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

//Connect data base here 
const { testDatabaseConnection, } = require("./config/database");

//Testing routes of functionalities
const testRoutes = require("./routes/testRoutes");


const authRoutes = require("./routes/authRoutes");


//All middlwares here 


//this is for cors to make request from different origin

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//json parsing middleware

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

//Routes start from here 

//This si test route to test functionalities created
app.use("/api/test", testRoutes);

app.use("/api/auth",authRoutes);

//starting route to check 
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Store Rating Portal API is running",
  });
});

//connection to start the app 
const startServer = async () => {

  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();