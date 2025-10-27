const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const pool = require("./utils/dbconnection");
const authRoute = require("./routes/auth.routes");
const postRoute = require("./routes/post.routes")
const app = express();
const PORT = process.env.PORT | 3000
app.use(express.json());


app.use('/auth', authRoute)
app.use('/posts', postRoute)

app.use((err, req, res, next) => {
  res.status(500).send("Error connecting to the server");
});

pool.query('SELECT 1 ', (err, result)=>{
    if(err){
        console.log('connection to the database failed')
        console.log(err.stack)
        process.exit(1)
    }

    console.log('Connection to the database succesful')
})

app.listen(PORT, (err)=>{
    if(err){
        console.log(err.stack)
        return
    }
    console.log(`Server running on ${PORT}`)
})


