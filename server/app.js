const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4343;
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./database/dbConnection');
const mainRouter = require('./routes/userRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOptions));
connectDB();

app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.use('/api', mainRouter);

app.listen(port, (err)=>{
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
})