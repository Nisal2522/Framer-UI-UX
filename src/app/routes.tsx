import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { ACDashboard } from "./components/ACDashboard";
import { ACProfile } from "./components/ACProfile";
import { CommitteeStructure } from "./components/CommitteeStructure";
import { Members } from "./components/Members";
import { Member360Form } from "./components/Member360Form";
import { BusinessPlanTemplate } from "./components/BusinessPlanTemplate";
import { AssetManagement } from "./components/AssetManagement";
import { KnowledgeManagement } from "./components/KnowledgeManagement";
import { Reports } from "./components/Reports";
import { Login } from "./components/Login";
import { LandingPage } from "./components/LandingPage";
import { NationalDashboard } from "./components/admin/NationalDashboard";
import { CommuneVerification } from "./components/admin/CommuneVerification";
import { AdminBusinessPlanWorkflow } from "./components/admin/AdminBusinessPlanWorkflow";
import { ProgressReportingAdmin } from "./components/admin/ProgressReportingAdmin";
import { AdminReportingDashboard } from "./components/admin/AdminReportingDashboard";

const routes = [
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Root,
    children: [
      { index: true, Component: ACDashboard },
      { path: "ac-profile", Component: ACProfile },
      { path: "committee-structure", Component: CommitteeStructure },
      { path: "farmer-members", Component: Members },
      { path: "farmer-members/new", Component: Member360Form },
      { path: "farmer-members/edit/:memberId", Component: Member360Form },
      { path: "business-plans", Component: BusinessPlanTemplate },
      { path: "business-plans/new", Component: BusinessPlanTemplate },
      { path: "assets", Component: AssetManagement },
      { path: "knowledge", Component: KnowledgeManagement },
      { path: "reports", Component: Reports },
      { path: "admin", Component: NationalDashboard },
      { path: "admin/commune-verification", Component: CommuneVerification },
      { path: "admin/business-plans", Component: AdminBusinessPlanWorkflow },
      { path: "admin/progress-reporting", Component: ProgressReportingAdmin },
      { path: "admin/knowledge", Component: KnowledgeManagement },
      { path: "admin/reporting", Component: AdminReportingDashboard },
    ],
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});