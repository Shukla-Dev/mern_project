import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//user Register
export const register = async (req, res) => {
	try {
		const {
			firstName,
			lastName,
			email,
			password,
			picturePath,
			friends,
			location,
			occupation,
		} = req.body;

		const salt = await bcrypt.genSalt();
		const hashedPassword = bcrypt.hash(password, salt);

		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			picturePath,
			friends,
			location,
			occupation,
			viewedProfile: Math.floor(Math.random() * 10000),
			impressions: Math.floor(Math.random() * 10000),
		});
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// login
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) res.status(404).json({ message: 'User does not exist.' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) res.statue(400).json({ message: 'Invalid Credentials' });

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '2h',
		});
		delete user.password;

		res.status(200).json(token, user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
