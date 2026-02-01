const mongoose = require('mongoose');
const Student = require('../models/Student');
const Counter = require('../models/Counter');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://student_db_minipro:rtr2025@studentdatabase.wjsixmy.mongodb.net/educational_db?retryWrites=true&w=majority';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const students = await Student.find({ studentId: { $exists: false } });
        console.log(`Found ${students.length} students without studentId`);

        for (const student of students) {
            const counter = await Counter.findByIdAndUpdate(
                'studentId',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            student.studentId = `SID${String(counter.seq).padStart(5, '0')}`;
            await student.save();
            console.log(`Assigned ${student.studentId} to ${student.name}`);
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
