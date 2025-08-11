import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Index from "../components/Feature-components/Index";
import AutomationPage from "../pages/AutomationPage";
import Layout from "../components/Feature-components/power-up/Layout";
import Featured from "../components/Feature-components/power-up/Featured";
import Automation from "../components/Feature-components/power-up/Automation";
import Analytics from "../components/Feature-components/power-up/Analytics";
import DeveloperTools from "../components/Feature-components/power-up/DeveloperTools";
import BoardUtilities from "../components/Feature-components/power-up/BoardUtilities";
import ProjectManagement from "../components/Feature-components/power-up/ProjectManagement";
import Operations from "../components/Feature-components/power-up/Operations";
import SolutionTemplate from "../components/solutions/SolutionTemplate";
import SignIn from "../components/Authentication/SignIn";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Dashboard from "../pages/Dashboard";
import SignUp from "../components/Authentication/SignUp";
import LandingLayout from "../components/LandingLayout";
import EditComp from "../components/Dashboard/EditComp";
import LoggedInLayout from "../components/LoggedInLayout";
import AllWorkspaces from "../components/Dashboard/AllWorkspaces";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import Boards from "../components/workspace/Boards";
import Members from "../components/workspace/Members";
import Table from "../components/workspace/Table";
import Board from "../components/workspace/Boards/Single-Board/Board";
import CardModal from "../components/workspace/Boards/Single-Board/CardModal";
import CalendarPage from "../components/workspace/Calendar";
import { featurePages, solutionPages } from "./data";
import ResetPasswordWithOTP from "@/components/Authentication/ResetPasswordWithOTP";
import EnterOTP from "@/components/Authentication/EnterOTP";
import EnterEmail from "@/components/Authentication/EnterEmail";
import BoardView from "@/components/Dashboard/BoardView";
import MembersPageLayout from "@/components/Dashboard/Members/MembersPageLayout";
import MembersOutlet from "@/components/Dashboard/Members/MembersOutlet";
import GuestPage from "@/components/Dashboard/Members/GuestPage";
import Requests from "@/components/Dashboard/Members/Requests";
import { BoardLink } from "@/components/workspace/Join/BoardLink";
import { WorkspaceLink } from "@/components/workspace/Join/WorkspaceLink";

const AllRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { token, emailEntered } = useSelector(
    (state: RootState) => state.resetPassword
  );
  [];
  const location = useLocation();
  const background = location?.state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route element={<LandingLayout />}>
          <Route
            path="/user/forget/enter-email"
            element={
              user ? (
                <Navigate to="/user/dashboard" />
              ) : emailEntered ? (
                token ? (
                  <Navigate to="/user/forget/reset-password" />
                ) : (
                  <Navigate to="/user/forget/enter-otp" />
                )
              ) : (
                <EnterEmail />
              )
            }
          />

          <Route
            path="/user/forget/enter-otp"
            element={
              user ? (
                <Navigate to="/user/dashboard" />
              ) : emailEntered ? (
                token ? (
                  <Navigate to="/user/forget/reset-password" />
                ) : (
                  <EnterOTP />
                )
              ) : (
                <Navigate to="/user/forget/enter-email" />
              )
            }
          />

          <Route
            path="/user/forget/reset-password"
            element={
              user ? (
                <Navigate to="/user/dashboard" />
              ) : (
                <ResetPasswordWithOTP />
              )
            }
          />
          <Route path="/" element={<Home />} />
          {featurePages.map((pageData, idx) => (
            <Route
              key={idx}
              path={`/feature/${pageData.page}`}
              element={<Index {...pageData} />}
            />
          ))}
          <Route path="/feature/automation" element={<AutomationPage />} />
          <Route element={<Layout />}>
            <Route path="/feature/power-ups/featured" element={<Featured />} />
            <Route
              path="/feature/power-ups/automation"
              element={<Automation />}
            />
            <Route
              path="/feature/power-ups/analytics-reporting"
              element={<Analytics />}
            />
            <Route
              path="/feature/power-ups/developer-tools"
              element={<DeveloperTools />}
            />
            <Route
              path="/feature/power-ups/board-utilities"
              element={<BoardUtilities />}
            />
            <Route
              path="/feature/power-ups/hr-operations"
              element={<Operations />}
            />
            <Route
              path="/feature/power-ups/project-management"
              element={<ProjectManagement />}
            />
          </Route>
          {solutionPages.map((pageData, idx) => (
            <Route
              key={idx}
              path={pageData.to}
              element={<SolutionTemplate {...pageData} />}
            />
          ))}
          <Route
            path="/user/sign-in"
            element={user ? <Navigate to={"/user/dashboard"} /> : <SignIn />}
          />
          <Route
            path="/user/sign-up"
            element={user ? <Navigate to={"/user/dashboard"} /> : <SignUp />}
          />
        </Route>
        <Route
          element={user ? <LoggedInLayout /> : <Navigate to="/user/sign-in" />}
        >
          <Route element={<BoardLink />} path="/join/:workspaceId/:boardId/:token" />
          <Route element={<WorkspaceLink />} path="/join/:workspaceId/:token" />
          <Route path="/user/dashboard" element={<Dashboard />}>
            <Route index element={<AllWorkspaces />} />
            <Route path="edit-info" element={<EditComp />} />
            <Route path=":workspaceId/boards-view" element={<BoardView />} />
            <Route path=":workspaceId" element={<MembersPageLayout />}>
              <Route path="members" element={<MembersOutlet />} />
              <Route path="guests" element={<GuestPage />} />
              <Route path="invites" element={<Requests />} />
            </Route>
          </Route>
        </Route>
        <Route
          path="/user/w/workspace/:workspaceId"
          element={
            user ? <WorkspaceLayout /> : <Navigate to={"/user/sign-in"} />
          }
        >
          <Route index element={<Boards />} />
          <Route
            path="/user/w/workspace/:workspaceId/members"
            element={<Members />}
          />
          <Route
            path="/user/w/workspace/:workspaceId/table"
            element={<Table />}
          />
          <Route
            path="/user/w/workspace/:workspaceId/calendar"
            element={<CalendarPage />}
          />
          <Route
            path="/user/w/workspace/:workspaceId/board/:boardId"
            element={<Board />}
          />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/user/w/workspace/:workspaceId/board/:boardId/card/:cardId"
            element={<CardModal />}
          />
        </Routes>
      )}
    </>
  );
};

export default AllRoutes;
