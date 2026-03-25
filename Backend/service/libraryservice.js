let rec = require("../models/Book");
let act = require("../models/activity");
let data = require("../models/da");
let penalty = require("../models/penalty");
let stu=require("../models/admission");
let nodemailer = require('nodemailer');
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_FROM = process.env.MAIL_FROM;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: MAIL_USER,
        pass: MAIL_PASS
    }
});

exports.addbook = async (req, res) => {
  let admin=req.admin;
  if(!admin){
    return res.status(403).json({ success: false, msg: "Unauthorized access. Admins only." });
  }
  let bookId = req.body.bookId;
  let bookName = req.body.bookName;
  let author = req.body.author;
  let quantity = req.body.quantity;
  let description = req.body.description;
  let category = req.body.category;
  let image =  req.file.filename; 
  let book = new rec({
    bookId: bookId,
    bookName: bookName,
    description:description,
    author: author,
    quantity: quantity,
    category: category,
    image: image,  
    status: 'Available'  
  });

  try {
    await book.save();
    return res
      .status(201)
      .json({ success: true, msg: "Book added successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, msg: "Error while adding the book" });
  }
};



exports.viewbook=async(req,res)=>
{
    let admin=req.admin;
    if(!admin){
      return res.status(403).json({ success: false, msg: "Unauthorized access. Admins only." });
    }
  let librarylist = await rec.find();
  console.log(librarylist);

  if (librarylist.length === 0) {
    return res.status(404).json({ success: false, msg: 'No books found' });
  }

  return res.status(200).json({
    success: true,
    msg: 'All book details fetched successfully',
    book: librarylist,
  });
}


exports.deletebook=async(req,res)=>
{       console.log(req.params.id);
         let id=req.params.id;
        await rec.deleteOne({_id:id});
        return res.status(200).json({success:true,msg:"delete successfully!!"});
}



exports.issuebook = async (req, res) => {

    console.log("hello");
    try {

        const bookId = req.body.bookId;
        console.log(bookId);
        let student = req.adm; 
        console.log(student);

        if (!bookId) {
            return res.status(400).json({ success: false, msg: "Book ID is required." });
        }

        const alreadyIssued = await data.findOne({
            bookId: bookId,
            studentId: student.id,
            action: 'issued' 
        });

        if (alreadyIssued) {
            return res.status(400).json({ success: false, msg: "This book is already issued to this student and has not been returned yet." });
        }

        const book = await rec.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, msg: "Book not found in inventory." });
        }

        if (book.quantity < 1) {
            return res.status(400).json({ success: false, msg: "Book not available in stock." });
        }

        book.quantity -= 1;
        if (book.quantity === 0) {
            book.status = 'Not Available';
        }
        await book.save();

        const issueRecord = new data({
            bookId: bookId,
            studentId: student.id,
            studentName: student.name,
            action: 'issued',
            date: new Date()
        });

        const activity = new act({
            bookId: bookId,
            studentId: student.id,
            studentName: student.name,
            action: 'issued',
            date: new Date()
        });

        await issueRecord.save();
        await activity.save();

        return res.status(200).json({ success: true, msg: "Book issued successfully." });
    } catch (err) {
        console.error('Error while issuing book:', err);
        return res.status(500).json({ success: false, msg: "Internal server error while issuing book." });
    }
};

exports.issued = async (req, res) => {
  try {
    const student = req.adm; 
    const issuedBooks = await data.find({ studentId: student.id, action: 'issued' });
    console.log("Issued Books:", issuedBooks);

    if (issuedBooks.length === 0) {
      return res.status(404).json({ success: false, msg: "No issued books found." });
    }
    return res.status(200).json({ success: true, books: issuedBooks });
  } catch (err) {
    return res.status(500).json({ success: false, msg: "Error fetching issued books: " + err.message });
  }
};



exports.returnbook = async (req, res) => {
    try {
        const bookId = req.body.bookId;
        let student = req.adm; 

        if (!bookId) {
            return res.status(400).json({ success: false, msg: "book id not provided" });
        }
        const book = await rec.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, msg: "Book not found in library." });
        }

        const issueRecord = await data.findOne({
            bookId: bookId,
            studentId: student.id,
            action: 'issued'
        });
        
        if (!issueRecord) {
            return res.status(404).json({ success: false, msg: "This book was not found as issued to the current student or it was already returned." });
        }

        book.quantity += 1;
        if (book.quantity > 0) {
            book.status = 'Available';
        }
        await book.save();
        issueRecord.action = 'returned';
        issueRecord.returnDate = new Date(); 
        await issueRecord.save();
        const activity = new act({
            bookId: bookId,
            studentId: student.id,
            studentName: student.name,
            action: 'returned',
            date: new Date(),
        });
        await activity.save();

        return res.status(200).json({ success: true, msg: "Book returned successfully. Inventory updated." });

    } catch (err) {
        console.error('Error while returning the book:', err);
        return res.status(500).json({ success: false, msg: "Error while returning book: " + err.message });
    }
};

exports.penalty = async (req, res) => 
{
    let student = req.adm;
    let studentId = student.id;
    let studentName = student.name;
    let daysOverdue = req.body.daysDiff ;
    let penaltyAmount = 0;
    console.log("Days Overdue:", daysOverdue);
    if(daysOverdue>=2)
    {
         penaltyAmount = (daysOverdue-2) * 50;

    }

    const penaltyRecord = new penalty({
        studentId: studentId,
        studentName: studentName,
        bookId: req.body.bookId,
        daysOverdue: daysOverdue,
        penaltyAmount: penaltyAmount,
        date: new Date()
    });

    await penaltyRecord.save();
    return res.status(200).json({ success: true, msg: "Penalty recorded successfully.", penalty: penaltyRecord });
}
     

exports.viewpenalty = async (req, res) =>
{
    let student = req.adm;
    let studentId = student.id;
    try {
        const penalties = await penalty.find({ studentId: studentId }).sort({ date: -1 });
        return res.status(200).json({ success: true, msg: "Penalty details fetched successfully.", penalties: penalties });
    } catch (err) {
        console.error('Error fetching penalty details:', err);
        return res.status(500).json({ success: false, msg: "Error fetching penalty details: " + err.message });
    }
}

exports.viewallpenalty = async (req, res) =>
{
    let admin=req.admin;
    if(!admin){
        return res.status(403).json({ success: false, msg: "Unauthorized access. Admins only." });
    }
    try {
        const penalties = await penalty.find({}).sort({ date: -1 });
        return res.status(200).json({ success: true, msg: "All penalty details fetched successfully.", penalties: penalties });
    } catch (err) {
        console.error('Error fetching all penalty details:', err);
        return res.status(500).json({ success: false, msg: "Error fetching all penalty details: " + err.message });
    }       
}

exports.paypenalty = async (req, res) =>{
    let student = req.adm;
    let studentId = student.id;
    let penaltyId = req.body.penaltyId;
    console.log("Paying penalty with ID:", penaltyId, "for student ID:", studentId);

    try {
        const penaltyRecord = await penalty.findOne({ _id: penaltyId, studentId: studentId });
        if (!penaltyRecord) {
            return res.status(404).json({ success: false, msg: "Penalty record not found." });
        }
        penaltyRecord.status = 'Paid';
        await penaltyRecord.save();
        return res.status(200).json({ success: true, msg: "Penalty marked as paid successfully.", penalty: penaltyRecord });
    } catch (err) {
        console.error('Error updating penalty status:', err);
        return res.status(500).json({ success: false, msg: "Error updating penalty status: " + err.message });
    }

}

exports.penaltyreminder = async (req, res) => 
    {
        let admin=req.admin;
        if(!admin){
            return res.status(403).json({ success: false, msg: "Unauthorized access. Admins only." });
        }
        let studentid=req.body.studentId;
        let student=await stu.findOne({id:studentid});
        if(!student){
            return res.status(404).json({ success: false, msg: "Student not found." });
        }
        let email=student.email;
        let amount=req.body.amount;

        let mail = {
            from: MAIL_FROM,
            to: email,
            subject: 'Library Penalty Reminder',
            text: `Dear ${student.name},\n\nThis is a reminder that you have an outstanding library penalty of ₹${amount}. Please make the payment at your earliest convenience to avoid further penalties.\n\nThank you,\nEduPulse Library`
        };

        await transporter.sendMail(mail);
        return res.status(200).json({ success: true, msg: `Penalty reminder sent successfully to ${email}.` });
        
    }


exports.viewactivity = async (req, res) => 
{
    let admin=req.admin;
    if(!admin){
        return res.status(403).json({ success: false, msg: "Unauthorized access. Admins only." });
    }
    try {
        const activities = await act.find({}).sort({ date: -1 });
        return res.status(200).json({ success: true, msg: "Activity log fetched successfully.", activities: activities });
    } catch (err) {
        console.error('Error fetching activity log:', err);
        return res.status(500).json({ success: false, msg: "Error fetching activity log: " + err.message });
    }
}    

exports.currentissued = async (req, res) => {
    let admin=req.admin;
    if(!admin){
        return res.status(403).json({ success: false, msg: "Unauthorized access. Admins only." });
    }
    try {
        const issuedBooks = await data.find({ action: 'issued' }).sort({ date: -1 });
        return res.status(200).json({ success: true, msg: "Currently issued books fetched successfully.", issuedBooks: issuedBooks });
    }
    catch (err) {
        console.error('Error fetching currently issued books:', err);
        return res.status(500).json({ success: false, msg: "Error fetching currently issued books: " + err.message });
    }
}

