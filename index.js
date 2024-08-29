import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { registerValidation } from './validations/auth.js';

import UserModel from './models/User.js';

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

app.post('/auth/register', registerValidation, async(req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
          email: req.body.email,
          fullName: req.body.fullName,
          avatarUrl: req.body.avatarUrl,
          passwordHash: hash,
        });
    
        const user = await doc.save();
    
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '30d',
          },
        );
    
        const { passwordHash, ...userData } = user._doc;
    
        res.json({
          ...userData,
          token,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: 'Не удалось зарегистрироваться',
        });
      }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});