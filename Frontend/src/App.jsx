import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AllLogin from './Pages/AllLogin'
import AdminLogin from './Pages/AdminLogin'
import Dashboard from './Pages/Dashboard'
import Stafflogin from './Pages/StaffLogin'
import StudentLogin from './Pages/StudentLogin'
import UpdateStaff from './Pages/UpdateStaff'
import UpdateStudent from './Pages/UpdateStudent'
import ViewStaff from './Pages/ViewStaff'
import ViewStudent from './Pages/ViewStudent'
import Registration from './Pages/StaffRegistration'
import UpdateDepartment from './Pages/UpdateDepartment'
import ViewDepartment from './Pages/ViewDepartment'
import DeptRegistration from './Pages/DepartRegistration'
import StaffProfile from './Pages/StaffProfile'
import StudentDashboard from './Pages/StudentDashboard'
import StaffDashboard from './Pages/StaffDashboard'
import StudentProfile from './Pages/StudentProfile'
import Notices from './Pages/Notices'
import ViewNotices from './Pages/ViewNotices'
import ViewFeedback from './Pages/ViewFeedback'
import ViewBook from './Pages/ViewBook'
import UpdateSalary from './Pages/UpdateSalary'
import Feedback from './Pages/Feedback'
import Test from './Pages/Test'
import SalaryRegister from './Pages/SalaryRegister'
import AddBook from './Pages/AddBook'
import ViewSalary from './Pages/ViewSalary'
import ViewAssignment from './Pages/ViewAssignment'
import AssFeed from './Pages/AssFeed'
import Assignment from './Pages/Assignment'
import ViewAssFeed from './Pages/ViewAssFeed'
import AssignmentSubmission from './Pages/AssignmentSubmission'
import ViewSubmissions from './Pages/ViewSubmission'
import StuAttendance from './Pages/StuAttendance'
import StaffAttendance from './Pages/StaffAttendance'
import Managebook from './Pages/Managebook'
import Admission from './Pages/Admission'
import Adminprofile from './Pages/Adminprofile'
import FeePayment from './Pages/payfee'
import ViewTest from './Pages/viewTest'
import QuizDetails from './Pages/Quiz'
import Viewresult from './Pages/Viewresult'
import SubjectRegistration from './Pages/SubjectRegistration'
import ExamMarksRegistration from './Pages/marks'
import RoomAvailabilityComponent from './Pages/room'
import HostelRegistrationForm from './Pages/hostel'
import BusConditionUpdate from './Pages/transportcondition'
import BusConditionView from './Pages/transportconditionview'
import DriverDetailsForm from './Pages/driverdetail'
import ViewDrivers from './Pages/viewdriver'
import AddRoutes from './Pages/addroutes'
import ViewRoutes from './Pages/viewRoutes'
import TransportRegister from './Pages/studenttransportdetails'
import StudentTransportDetails from './Pages/stutranviewadmin'
import ViewNoticess from './Pages/ViewNotice2'
import StudentTransportDashboard from './Pages/StudentTransport'
import StudentFeePortal from './Pages/hostelfee'
import DeleteBooks from './Pages/ViewBook2'
import ReportCard from './Pages/Reportcard'
import UT1ReportCard from './Pages/Ut1'
import UT2ReportCard from './Pages/Ut2'
import MidTermReportCard from './Pages/MidTerm'
import FinalReportCard from './Pages/final'
import ViewStaffProfile from './Pages/viewstaffprofile'
import ProfileStudent from './Pages/StudentById'
import LiveTracker from './Pages/LiveTracker'
import StudentSubmissions from './Pages/StudentSubmissions'
import StudentPri from './Components/privatestudent'
import PTMMeeting from './Pages/PTMMeeting'
import Updatestaffpersonal from './Pages/Updatestaffpersonal'
import Updatestudentpersonal from './Pages/updatestudentpersonal'
import JoinMeeting from './Components/JoinMeeting'
import Viewhostel from './Pages/Viewhostel'
import Adminviewhostel from './Pages/Adminviewhostel'
import Bookactivity from './Pages/Bookactivity'
import Issuedbooks from './Pages/Issuedbooks'
import Viewpenalty from './Pages/Viewpenalty'
import Paypenalty from './Pages/Paypenalty'
import SalaryPayment from './Pages/SalaryPayment'
import FaceAttendance from './Pages/FaceAttendance'

const mockUser = Object.freeze({ role: "staff" });
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<AllLogin/>}/>
        <Route path='/AdminLogin' element={<AdminLogin/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/StaffLogin' element={<Stafflogin/>}/>
        <Route path='/StudentLogin' element={<StudentLogin/>}/>
        <Route path='/UpdateStaff/:staffId' element={<UpdateStaff/>}/>
        <Route path='/UpdateStudent/:id' element={<UpdateStudent/>}/>
        <Route path='/ViewStaff' element={<ViewStaff/>}/>
        <Route path='/ViewStudent' element={<ViewStudent/>}/>
        <Route path='/StaffRegistration' element={<Registration/>}/>
        <Route path='/UpdateDepartment/:deptId' element={<UpdateDepartment/>}/>
        <Route path='/ViewDepartment' element={<ViewDepartment/>}/>
        <Route path='/DeptRegistration' element={<DeptRegistration/>}/>
        <Route path='/StaffProfile' element={<StaffProfile/>}/>
        <Route path='/StudentDashboard' element={<StudentPri><StudentDashboard/></StudentPri>}/>
        <Route path='/StaffDashboard' element={<StaffDashboard/>}/>
        <Route path='/StudentProfile' element={<StudentProfile/>}/>
        <Route path='/Notice' element={<Notices/>}/>
        <Route path='/ViewNotices' element={<ViewNotices/>}/>
        <Route path='/ViewFeedback' element={<ViewFeedback/>}/>
        <Route path='/AddBook' element={<AddBook/>}/>
        <Route path='/ViewBook' element={<ViewBook/>}/>
        <Route path='/UpdateSalary/:salaryId' element={<UpdateSalary/>}/>
        <Route path='/Test' element={<Test/>}/>
        <Route path='/SalaryRegistration' element={<SalaryRegister/>}/>
        <Route path='/Feedback' element={<Feedback/>}/>
        <Route path='/ViewSalary' element={<ViewSalary/>}/>
        <Route path='/AssFeed/:submissionId' element={<AssFeed/>}/>
        <Route path='/Assignment' element={<Assignment/>}/>
        <Route path='/ViewAssFeed' element={<ViewAssFeed/>}/>
        <Route path='/AssignmentSubmission/:assignmentId' element={<AssignmentSubmission/>}/>
        <Route path='/ViewSubmission' element={<ViewSubmissions/>}/>
        <Route path='/ViewAssignment' element={<ViewAssignment/>}/>
        <Route path='/StuAttendance' element={<StuAttendance/>}/>
        <Route path='/StaffAttendance' element={<StaffAttendance/>}/>
        <Route path='/issued' element={<Managebook/>}/>
        <Route path='/Admission' element={<Admission/>}/>
        <Route path='/Adminprofile' element={<Adminprofile/>}/>
        <Route path='/payfee' element={<FeePayment/>}/>
        <Route path='/Managebook' element={<Managebook/>}/>
        <Route path='/viewTest' element={<ViewTest/>}/>
        <Route path="/view-test/:title" element={<QuizDetails />} />
        <Route path='/viewresult/:title' element={<Viewresult/>}/>
        <Route path='/SubjectRegistration' element={<SubjectRegistration/>}/>
        <Route path='/marks' element={<ExamMarksRegistration/>}/>  
        <Route path='/addroom' element={<RoomAvailabilityComponent/>}/>
        <Route path='/hostelregistration' element={<HostelRegistrationForm/>}/> 
        <Route path='/busconditionupdate' element={<BusConditionUpdate/>}/>
        <Route path='/busconditionview' element={<BusConditionView/>}/>
        <Route path='/driverdetail' element={<DriverDetailsForm/>}/>
        <Route path='/driverdetailview' element={<ViewDrivers/>}/>
        <Route path='/addroute' element={<AddRoutes/>}/>
        <Route path='/viewroutes' element={<ViewRoutes/>}/>
        <Route path='/studenttransportdetails' element={<TransportRegister/>}/>
        <Route path='/viewallstudenttransport' element={<StudentTransportDetails/>}/>
        <Route path='/ViewNotice2' element={<ViewNoticess/>}/>
        <Route path='/StudentTransportAllDetails' element={<StudentTransportDashboard/>}/>
        <Route path='/hostelfees' element={<StudentFeePortal/>}/>
        <Route path='/ViewBook2' element={<DeleteBooks/>}/>
        <Route path='/reportcard' element={<ReportCard/>}/>
        <Route path='/ut1' element={<UT1ReportCard/>}/>
        <Route path='/ut2' element={<UT2ReportCard/>}/>
        <Route path='/midterm' element={<MidTermReportCard/>}/>
        <Route path='/final' element={<FinalReportCard/>}/>
        <Route path='/viewbyidstaff/:staffId' element={<ViewStaffProfile/>}/>
        <Route path='/ProfileStudent/:id' element={<ProfileStudent/>}/>
        <Route path='/liveTracker' element={<LiveTracker/>}/>
        <Route path='/sviewsubmission' element={<StudentSubmissions/>}/>
        <Route path='/updatestaffpersonal' element={<Updatestaffpersonal/>}/>
        <Route path='/updatestudentpersonal' element={<Updatestudentpersonal/>}/>
        <Route path="/ptm" element={<JoinMeeting role={mockUser.role} />}/>
        <Route path="/ptm/:roomId" element={<PTMMeeting />} />  
        <Route path="/ptm" element={<JoinMeeting role={mockUser.role} />} />
        <Route path="/ptm/:roomId" element={<PTMMeeting />} />
        <Route path='/viewhostel' element={<Viewhostel/>}/>
        <Route path='/adminviewstudentdetails' element={<Adminviewhostel/>}/>
        <Route path='/bookactivity' element={<Bookactivity/>}/>
        <Route path='/currentissued' element={<Issuedbooks/>}/>
        <Route path='/viewpenalty' element={<Viewpenalty/>}/>
        <Route path='/paypenalty' element={<Paypenalty/>}/>
        <Route path='/payment' element={<SalaryPayment/>}/>
        {/* PTM ROUTES (kept together) */}
        <Route
          path="/ptm"
          element={<JoinMeeting role={mockUser.role} />}
        />
        <Route path="/ptm/:roomId" element={<PTMMeeting />} />
        <Route path='/face-attendance' element={<StudentPri><FaceAttendance/></StudentPri>}/>

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
