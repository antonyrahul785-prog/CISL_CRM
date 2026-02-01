const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    reply: { type: String, enum: ['Interested', 'Not Interested', 'Reminder', 'Follow-up', 'Enrolled', 'Busy', 'Other'], default: 'Interested' },
    additionalInfo: { type: String },
    reminderDate: { type: Date },
    remind: { type: Boolean, default: false },
    isAdmitted: { type: Boolean, default: false },
    joiningDate: { type: Date },
    fee: { type: Number },
    referralBonus: { type: Number },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    referredBy: { type: String }
}, { timestamps: true });

// Pre-save middleware for student ID
StudentSchema.pre('save', async function (next) {
    if (this.studentId) return next();

    try {
        const Counter = mongoose.model('Counter');
        const counter = await Counter.findByIdAndUpdate(
            'studentId',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.studentId = `SID${String(counter.seq).padStart(5, '0')}`;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Student', StudentSchema);
