const mongo= require('mongoose');

const payment = new mongo.Schema({
  staffId: { type: String, required: true },
  staffName: { type: String, required: true },
  staffMail: { type: String, required: true },
  staffDepartment: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  paymentDate: { type: Date, required: true }

});

module.exports = mongo.model('payment', payment);