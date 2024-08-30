import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';

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

app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});