const mongo= require('mongoose');

const penalty = new mongo.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    bookId: { type: String, required: true },
    daysOverdue: { type: Number, required: true },
    penaltyAmount: { type: Number, required: true },
    status: { type: String, default: 'Unpaid' , enum: ['Unpaid', 'Paid']},
    date: { type: Date, default: Date.now }
});

module.exports = mongo.model('penalty', penalty);