import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ApplyLoan from "./pages/ApplyLoan";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layout/AdminLayout";
import LoanFiles from "./pages/admin/LoanFiles";
import LoanFileDetails from "./pages/admin/LoanFileDetails";
import CreateLoanAgent from "./pages/agent/CreateLoan";
import Unauthorized from "./pages/Unauthorized";
import AgentDashboard from "./pages/agent/AgentDashboard";
import LoanDetails from "./pages/loan/LoanDetails";
import CreateLoanAdmin from "./pages/admin/CreateLoan";
import EditLoan from "./pages/admin/EditLoan";
import Users from "./pages/admin/Users";
import CreateUser from "./pages/admin/CreateUser";
import EditUser from "./pages/admin/EditUser";
import UserDetails from "./pages/admin/UserDetails";
import Customers from "./pages/admin/Customers";
import CreateCustomer from "./pages/admin/CreateCustomer";
import EditCustomer from "./pages/admin/EditCustomer";
import CustomerDetails from "./pages/admin/CustomerDetails";
import Banks from "./pages/admin/Banks";
import CreateBank from "./pages/admin/CreateBank";
import EditBank from "./pages/admin/EditBank";
import Documents from "./pages/admin/Documents";
import UploadDocument from "./pages/admin/UploadDocument";
import Commission from "./pages/commission/Commission";
import AddCommission from "./pages/commission/AddCommission";
import CommissionDetails from "./pages/commission/CommissionDetails";
import StatusDashboard from "./pages/status/StatusDashboard";
import UpdateStatus from "./pages/status/UpdateStatus";
import BankExecutiveDashboard from "./pages/executive/BankExecutiveDashboard";
import ExecutiveAssignment from "./pages/executive/ExecutiveAssignment";
import AssignExecutive from "./pages/executive/AssignExecutive";
import AssignmentDetails from "./pages/executive/AssignmentDetails";
import Reports from "./pages/reports/Reports";
import CustomerReports from "./pages/reports/CustomerReports";
import CommissionReports from "./pages/reports/CommissionReports";
import MyFiles from "./pages/executive/MyFiles";
import BankReports from "./pages/reports/BankReports";
import ExecutiveUpdateStatus from "./pages/executive/ExecutiveUpdateStatus";
import ExecutiveDocuments from "./pages/executive/ExecutiveDocuments";
import ExecutiveProfile from "./pages/executive/ExecutiveProfile";
import ExecutiveLayout from "./components/layout/ExecutiveLayout";
import DocumentVerification from "./pages/executive/DocumentVerification";
import FileDetails from "./pages/FileDetails";
import DataOperatorDashboard from "./pages/data-operator/DataOperatorDashboard";
import DataOperatorLayout from "./components/layout/DataOperatorLayout";
import MarketingDashboard from "./pages/marketing/MarketingDashboard";
import MarketingLayout from "./components/layout/MarketingLayout";
import AllLeads from "./pages/marketing/AllLeads";
import ConvertedLeads from "./pages/marketing/ConvertedLeads";
import MarketingReports from "./pages/marketing/MarketingReports";
import MarketingPerformance from "./pages/marketing/MarketingPerformance";
import LoanApplication from "./pages/LoanApplication";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import BalanceTransferForm from "./pages/BalanceTransferForm";
import MedicalLoanForm from "./pages/MedicalLoanForm";
import CustomerRegistration from "./pages/CustomerRegistration";




function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<ApplyLoan />} />
        <Route path="/login" element={<Login />} />
          <Route path="/loan-application" element={<LoanApplication />} /> {/* ← ADD THIS */}
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
                <Route path="/customer-registration" element={<CustomerRegistration />} />
        <Route path="/loan-application" element={<LoanApplication />} />
        <Route path="/balance-transfer" element={<BalanceTransferForm />} />
        <Route path="/medical-loan" element={<MedicalLoanForm />} />

        



        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="loan-files" element={<LoanFiles />} />
          <Route path="loan-files/:id" element={<LoanFileDetails />} />
          <Route path="create-loan" element={<CreateLoanAdmin />} />
          <Route path="edit-loan/:id" element={<EditLoan />} />
          <Route path="users" element={<Users />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="edit-user/:id" element={<EditUser />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="create-customer" element={<CreateCustomer />} />
          <Route path="edit-customer/:id" element={<EditCustomer />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="banks" element={<Banks />} />
          <Route path="create-bank" element={<CreateBank />} />
          <Route path="edit-bank/:id" element={<EditBank />} />
          <Route path="documents" element={<Documents />} />
          <Route path="upload-document" element={<UploadDocument />} />
          <Route path="commission" element={<Commission />} />
          <Route path="add-commission" element={<AddCommission />} />
          <Route path="commission/:id" element={<CommissionDetails />} />
          <Route path="status" element={<StatusDashboard />} />
          <Route path="status/update" element={<UpdateStatus />} />
          <Route path="executive-assignment" element={<ExecutiveAssignment />} />
          <Route path="assign-executive" element={<AssignExecutive />} />
          <Route path="assignment/:id" element={<AssignmentDetails />} />

          {/* Reports */}
          <Route path="reports" element={<Reports />} />
          <Route path="reports/customers" element={<CustomerReports />} />
          <Route path="reports/commissions" element={<CommissionReports />} />
          <Route path="reports/banks" element={<BankReports />} />

          {/* ✅ File Details + Update Status (Admin) */}
          <Route path="file/:id" element={<FileDetails />} />
          <Route path="file/:id/update-status" element={<FileDetails />} />
        </Route>

        {/* ================= BANK EXECUTIVE ROUTES ================= */}
        <Route path="/bank-executive" element={<ExecutiveLayout />}>
          <Route index element={<BankExecutiveDashboard />} />
          <Route path="my-files" element={<MyFiles />} />
          <Route path="update-status" element={<ExecutiveUpdateStatus />} />
          <Route path="documents" element={<ExecutiveDocuments />} />
          <Route path="verify-documents" element={<DocumentVerification />} />
          <Route path="profile" element={<ExecutiveProfile />} />

          {/* ✅ File Details + Update Status (Executive) */}
          <Route path="/bank-executive/file/:id" element={<FileDetails />} />
          <Route path="/bank-executive/file/:id/update-status" element={<FileDetails />} />
        </Route>

        {/* ================= DATA OPERATOR ROUTES ================= */}
        <Route path="/data-operator" element={<DataOperatorLayout />}>
          <Route index element={<DataOperatorDashboard />} />
          <Route path="create-customer" element={<CreateCustomer />} />
          <Route path="create-loan" element={<CreateLoanAdmin />} />
          <Route path="upload-document" element={<UploadDocument />} />
          <Route path="customers" element={<Customers />} />
          <Route path="loan-files" element={<LoanFiles />} />
          <Route path="documents" element={<Documents />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="edit-customer/:id" element={<EditCustomer />} />
          <Route path="edit-loan/:id" element={<EditLoan />} />
        </Route>


{/* Marketing Routes */}
<Route path="/marketing" element={<MarketingLayout />}>
  <Route index element={<MarketingDashboard />} />
  <Route path="customers" element={<AllLeads />} />
  <Route path="converted" element={<ConvertedLeads />} />
    <Route path="reports" element={<MarketingReports />} />
  <Route path="performance" element={<MarketingPerformance />} />

</Route>
        {/* ================= AGENT ROUTES ================= */}
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/create-loan"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <CreateLoanAgent />
            </ProtectedRoute>
          }
        />

        {/* ================= LOAN DETAILS ================= */}
        <Route path="/loan/:id" element={<LoanDetails />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
