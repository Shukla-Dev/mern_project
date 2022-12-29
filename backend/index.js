import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import helmet, { crossOriginResourcePolicy } from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import { register } from './controllers/auth.js';

//configuration
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);
const app = express();
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: ' 30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirName, 'public/assets')));

//File Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/assets');
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage });

//routes with files
app.post('/auth/register', upload.single('picture'), register);

//routes
app.use('/auth', authRoutes);

//mongoose setup
const PORT = process.env.PORT || 5001;
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('db connected successfully');
		app.listen(PORT, () => {
			console.log(`server is running on : ${PORT}`);
		});
	})
	.catch((error) => console.log(error));
