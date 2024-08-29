import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME


mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@backenddb.pwu7q.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=BackendDB`
).then(() => {console.log('DB OK')})
.catch((err) => console.log('DB Error', err))
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello2');
});

// 1. 
app.post('/auth/login', (req, res) => {
    console.log(req.body)

    const token = jwt.sign({
        email: req.body.email,
        fullName: 'Василий Пушкин', 
    },
    'secret123',
);

    res.json({
        success: true,
        token,
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});