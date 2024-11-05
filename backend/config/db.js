const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        // Log the MongoDB URI for debugging
        const uri = process.env.MONGODB_URI;
        console.log('MongoDB URI:', uri); // Check if URI is loaded correctly

        // Ensure the URI is defined
        if (!uri) {
            throw new Error('MongoDB URI is undefined. Please check your .env file.');
        }

        // Connect to MongoDB with options
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        if (error.message.includes('database exists')) {
            console.log('Database already exists');
        } else {
            console.error('Error connecting to MongoDB:', error.message);
        }
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
