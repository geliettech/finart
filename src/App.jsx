import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router";
import LandingPage from "@/pages/landing";
import SignInPage from "@/pages/auth/signIn";
import SignUpPage from "@/pages/auth/signUp";
import OverviewPage from "@/pages/dashboard/OverviewPage";
import DashboardLayout from "@/pages/dashboard/layout";
import TransactionsPage from "@/pages/dashboard/TransactionsPage";
import BudgetsPage from "@/pages/dashboard/BudgetsPage";
import RecurringPage from "@/pages/dashboard/RecurringPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import AdvisorPage from "@/pages/dashboard/AdvisorPage";
import ReportsPage from "@/pages/dashboard/ReportsPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import StaffLayout from "@/pages/staff/StaffLayout";
import StaffOverviewPage from "@/pages/staff/StaffOverviewPage";
import StaffCapabilityPage from "@/pages/staff/StaffCapabilityPage";
import StaffSettingsPage from "@/pages/staff/StaffSettingsPage";
import NotFound from "@/pages/not-found";
import AppProvider from "@/layout/context/appProvider";
import ProtectRoute from "@/hooks/useRoute";
import StaffRoute from "@/hooks/StaffRoute";
import GuestRoute from "@/hooks/GuestRoute";
import ForgotPasswordPage from "@/pages/auth/forgotPassword";
import EmailVerifyPage from "@/pages/auth/emailVerify";
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <Router>
      <AppProvider>
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={<LandingPage />}
            />
            <Route
              path="/sign-in"
              element={
                <GuestRoute>
                  <SignInPage />
                </GuestRoute>
              }
            />
            <Route
              path="/sign-up"
              element={
                <GuestRoute>
                  <SignUpPage />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPasswordPage />
                </GuestRoute>
              }
            />
            <Route
              path="/email-verify"
              element={<EmailVerifyPage />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectRoute>
                  <DashboardLayout />
                </ProtectRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="recurring" element={<RecurringPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="advisor" element={<AdvisorPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route
              path="/staff"
              element={
                <StaffRoute>
                  <StaffLayout />
                </StaffRoute>
              }
            >
              <Route index element={<StaffOverviewPage />} />
              <Route path="users" element={<StaffCapabilityPage capability="users" />} />
              <Route path="subscriptions" element={<StaffCapabilityPage capability="subscriptions" />} />
              <Route path="analytics" element={<StaffCapabilityPage capability="analytics" />} />
              <Route path="support" element={<StaffCapabilityPage capability="support" />} />
              <Route path="reports" element={<StaffCapabilityPage capability="reports" />} />
              <Route path="audit-logs" element={<StaffCapabilityPage capability="auditLogs" />} />
              <Route path="system-health" element={<StaffCapabilityPage capability="systemHealth" />} />
              <Route path="settings" element={<StaffSettingsPage />} />
            </Route>
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;