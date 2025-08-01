// server.js (local storage)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (local storage)
// Make sure to have MongoDB running locally or adjust the connection string accordingly
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/chocoshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ MongoDB connected");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Define a simple user schema
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    isLoggedIn: Boolean
});

const User = mongoose.model('User', userSchema);


// In-memory cart store
let cart = [];

app.post('/api/cart', (req, res) => {
    const { name } = req.body;

    let item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += 1;
    } else {
        item = { name, quantity: 1 };
        cart.push(item);
    }

    res.json(item);
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

//delete function
app.delete('/api/cart', (req, res) => {
    cart = [];
    res.status(204).send(); // 204 = No Content
});

//Adds authentication logic
const bcrypt = require('bcrypt');
app.post('/api/signup', async (req, res) => {
    try {
        const { name, password } = req.body;

        const existing = await User.findOne({ name });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, password: hashedPassword, isLoggedIn: false });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

        // Login endpoint
        app.post('/api/login', async (req, res) => {
            try {
                const { name, password } = req.body;

        // Input validation
        if (typeof name !== 'string' || typeof password !== 'string' || !name.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Name and password are required and must be non-empty strings' });
        }

        const user = await User.findOne({ name });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Incorrect password' });

        user.isLoggedIn = true;
        await user.save();

        res.json({ message: 'Login successful', user: { name: user.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// (Removed duplicate signup and login logic using 'users' array)

app.listen(5000, () => console.log('🚀 Server running at http://localhost:5000'));