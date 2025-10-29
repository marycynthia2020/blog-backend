const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("./utils/dbconnection");
const authRoute = require("./routes/auth.routes");
const postRoute = require("./routes/post.routes");
const app = express();
const PORT = process.env.PORT | 3000;
app.use(express.json());

app.use("/auth", authRoute);
app.use("/posts", postRoute);

app.use((err, req, res, next) => {
  res.status(500).send("Error connecting to the server");
});

async function startServer() {
  try {
    const [result, fields] = await pool.query("SELECT 1");
    console.log(result);
    console.log(fields);
  } catch (error) {
    console.log("failed to connect to the database");
  }

  app.listen(PORT, (err)=>{
    if(err){
        console.log(err.stack)
        return
    }
    console.log(`server is running on port ${PORT}`)
  })
}

startServer()
