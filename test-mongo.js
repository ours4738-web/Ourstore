const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found in environment');
        process.exit(1);
    }

    console.log('Attempting to connect to MongoDB...');
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Mongoose Connection State:', mongoose.connection.readyState);
        if (mongoose.connection.readyState === 1) {
            console.log('SUCCESS: Connected to MongoDB.');
        } else {
            console.log('Connection state is not 1 (connected). State:', mongoose.connection.readyState);
        }
        await mongoose.disconnect();
        console.log('Disconnected.');
        process.exit(0);
    } catch (err) {
        console.error('CONNECTION ERROR:', err.message);
        process.exit(1);
    }
}

testConnection();
