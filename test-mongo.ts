import connectDB from './lib/mongodb';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        console.log('URI:', process.env.MONGODB_URI);
        await connectDB();
        console.log('Mongoose connection state:', mongoose.connection.readyState);
        if (mongoose.connection.readyState === 1) {
            console.log('Successfully connected to MongoDB!');
        } else {
            console.log('Connection state is not 1 (connected). Current state:', mongoose.connection.readyState);
        }
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('FAILED to connect to MongoDB:');
        console.error(error);
        process.exit(1);
    }
}

testConnection();
