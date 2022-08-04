require('dotenv').config();
const express = require('express');
const connect = require('./src/config/db');
const Port = process.env.PORT;
const cors = require('cors');
const {register, login, forgot} = require('./src/controllers/users.controller');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/register', register);
app.use('/login', login);
app.use('/forgot', forgot);

app.listen(Port, async()=>{
    try {
        await connect();
        console.log(`running on Port ${Port}...`)
    } catch (error) {
        console.log(error);
    }
})