import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const app = express();

dotenv.config();

app.use(express.json());

app.get('/', (req, res) => {
	res.send('welcome to social media api!!');
});

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('db connected successfully');
		app.listen(5000, () => {
			console.log('server is running on : 5000');
		});
	})
	.catch((error) => console.log(error));
