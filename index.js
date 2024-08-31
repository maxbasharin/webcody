import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

dotenv.config();

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@backenddb.pwu7q.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=BackendDB`
).then(() => {console.log('DB OK')})
.catch((err) => console.log('DB Error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', handleValidationErrors, loginValidation, UserController.login);
app.post('/auth/register', handleValidationErrors, registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
    '/posts/:id',
    checkAuth,
    postCreateValidation,
    PostController.update,
  );
app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});