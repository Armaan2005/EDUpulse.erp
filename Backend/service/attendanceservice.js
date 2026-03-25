let rec=require("../models/attendance");
let staffRec = require("../models/staff");

exports.addattendance=async(req,res)=>
{
       let id=req.body.id;
       let date=req.body.date;
       let status=req.body.status;
console.log("req body--",req.body);

        let data=await rec.findOne({id,date})
      if(data)
      {
        return res.status(404).json({success:false,msg:"this already exist"});
      }
      else{
      let record=new rec({id:id,date:date,status:status});
      await record.save();
      return res.status(201).json({success:true,msg:"attendance got marked"});
      }
}

exports.viewattendance = async (req, res) => {
  let attendancelist = await rec.find();
  console.log(attendancelist);
  if (attendancelist.length === 0) {
    return res.status(404).json({ success: false, msg: "No staff found" });
  }

  return res.status(200).json({
    success: true,
    msg: "All staff details fetched successfully",
    attendance: attendancelist,
  });
};

exports.attendancecheck=async(req,res)=>
  {
    console.log(req.body);
    const records = req.body.records;


  try {
    const results = [];

    for (let record of records) {
      const existing = await rec.findOne({
        date: record.date,id:record.id
      });

      if (!existing) {
        const attendanceRecord = new rec({
          id: record.id,
          status: record.status,
        date: record.date,
          });

       await attendanceRecord.save();
      }
    }
    return res.status(200).json({
      message: "Attendance records saved successfully",
      data: results,
    });

  } catch (error) {
    console.error("Error saving attendance:", error);
    return res.status(500).json({ message: "Error saving attendance records", error });
  }
};

exports.viewAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, msg: "date is required (YYYY-MM-DD)" });
    }

    const [staffList, attendanceList] = await Promise.all([
      staffRec.find({}, { _id: 0, id: 1, name: 1 }),
      rec.find({ date }, { _id: 0, id: 1, status: 1, date: 1 }),
    ]);

    const byId = new Map(attendanceList.map(r => [Number(r.id), r]));

    const rows = (staffList || []).map(s => {
      const id = Number(s.id);
      const found = byId.get(id);
      return {
        id,
        name: s.name,
        status: found?.status || "Leave",
        marked: Boolean(found),
      };
    });

    const summary = rows.reduce(
      (acc, r) => {
        acc.total += 1;
        if (r.status === "Full") acc.present += 1;
        else if (r.status === "Half") acc.half += 1;
        else acc.leave += 1;
        return acc;
      },
      { total: 0, present: 0, half: 0, leave: 0 }
    );

    return res.status(200).json({
      success: true,
      date,
      summary,
      attendance: rows,
    });
  } catch (error) {
    console.error("Error fetching staff attendance by date:", error);
    return res.status(500).json({ success: false, msg: "Failed to fetch attendance." });
  }
};