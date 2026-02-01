const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://student_db_minipro:rtr2025@studentdatabase.wjsixmy.mongodb.net/educational_db?retryWrites=true&w=majority';

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error(`Error: ${e.message}`);
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
