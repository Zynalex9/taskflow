import { Navigate, Route, Routes } from "react-router-dom";
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
import UserInfoComp from "../components/Dashboard/UserInfoComp";
import EditComp from "../components/Dashboard/EditComp";
import LoggedInLayout from "../components/LoggedInLayout";
import AllWorkspaces from "../components/Dashboard/AllWorkspaces";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";

const AllRoutes = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(user);
  const featurePages = [
    {
      page: "inbox",
      itemName: "Inbox",

      hero: {
        heading: "Trello Inbox",
        subheading: "Capture, organize, and conquer every to-do",
        buttonText: "Try Trello For Free",
        linkText: "Learn more about Taskflow's plans and pricing.",
        linkTo: "",
        image: "/inbox-hero.png",
      },
      captureHeader: {
        heading: "Capture Anytime",
        text: `Say goodbye to lost to-dos and scattered ideas! Trello Inbox saves you from the chaos of emails, messages, and notes. Jot down thoughts as they come or effortlessly snatch snippets from your favorite tools—no need to organize them right away.`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/76s8l9DR2ZxNhjevNpluXZ/04387ada53789d2209416c5fff14d9cd/inbox-subheader_.png?w=2280&fm=webp",
      },
      captureSections1: {
        heading: "Instant Capture",
        text: `No more missed opportunities! Capture tasks and ideas from your favorite tools, like email and Slack, in a flash, so you’ll never let important items slip away.`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/3bcHZVmKoRsaSDFZKJwXDw/77413476c30fe9e370b31735ab8acc21/inbox-email.png?w=1614&fm=webp",
      },
      captureSections2: {
        heading: "Seamless organization",
        text: `Ready to tidy up? Simply drag and drop your captured items into the right boards, making organization a breeze.`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/5DRtL3KwxCfXwlkz5KOktV/9ccca794c97e1667b267ef9b23559876/inbox-to-board.png?w=1614&fm=webp",
      },
      captureSections3: {
        heading: "Intuitive organization",
        text: `Got quick to-dos? Mark them "Done" straight from the Inbox and keep your momentum going!`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/409sOWzv1tfbFOOHEyjIzs/4d40324069846676dacf868fe3b373e0/inbox-donestate.png?w=1614&fm=webp",
      },
    },
    {
      page: "planner",
      itemName: "Planner",
      hero: {
        heading: "Trello Planner",
        secondHeading: "Plan, stay focused, and get more [sh*t] done",
        subheading:
          "Planner is your ultimate planning companion to unlock the power of staying in the zone and getting more done.",
        buttonText: "Get Started",
        linkText: "Learn more about Taskflow's plans and pricing.",
        linkTo: "",
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/5jLvxYsqWehh4tkm3FqMYj/eec08095626ec26259144e7055dd7d08/planner-hero.png?w=2280&fm=webp",
      },
      captureHeader: {
        heading: "Plan anytime, anywhere",
        text: `Focus and make time for what truly matters. Say goodbye to scattered schedules and missed deadlines! Trello Planner is your go-to tool for capturing and organizing your plans, whether you're at your desk or on the go.`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/76s8l9DR2ZxNhjevNpluXZ/04387ada53789d2209416c5fff14d9cd/inbox-subheader_.png?w=2280&fm=webp",
      },
      captureSections1: {
        heading: "Effortless scheduling",
        text: `Never miss a beat! Schedule tasks and events directly from your favorite tools, like Google Calendar and Outlook, ensuring you stay on top of everything.`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/5jLvxYsqWehh4tkm3FqMYj/eec08095626ec26259144e7055dd7d08/planner-hero.png?w=2280&fm=webp",
      },
      captureSections2: {
        heading: "Intuitive organization",
        text: `Ready to lock in your plans? Simply drag and drop your tasks into the right boards, making organization a breeze.`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/3EKhSNm6rGLbkmQbhL7d6l/9ae2600f804c8ae50c0fd4cb5c6b87dd/intuitive-organization.png?w=1614&fm=webp",
      },
      captureSections3: {
        heading: "Drag to Organize",
        text: `Just captured something? Drag and drop it into the perfect board later.`,
        image:
          "https://images.ctfassets.net/rz1oowkt5gyp/1EAMkyBfaJLQgiLvUqMiqQ/2c1013ad6d07c9d3a4ab1ef77d3a049e/stay-on-track.png?w=1614&fm=webp",
      },
    },
  ];

  return (
    <Routes>
      <Route element={<LandingLayout />}>
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
        <Route path="/solution" element={<SolutionTemplate />} />
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
        <Route path="/user/dashboard" element={<Dashboard />}>
          <Route index element={<UserInfoComp />} />
          <Route path="workspaces" element={<AllWorkspaces />} />
          <Route path="edit-info" element={<EditComp />} />
        </Route>
      </Route>
      <Route
        path="/user/w/workspace/:workspaceId"
        element={user ? <WorkspaceLayout /> : <Navigate to={"/user/sign-in"} />}
      >
        <Route index element={<h1>Ok so I am cool whats next?</h1>} />
        <Route
          path="second"
          element={<h1>Ok so I not cool whats next?</h1>}
        />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
