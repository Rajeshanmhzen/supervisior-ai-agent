import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import App from "../App";
import {
  AboutSkeleton,
  AuthCardSkeleton,
  AuthSplitSkeleton,
  ContactSkeleton,
  DashboardSkeleton,
  HomeSkeleton,
  ProjectViewSkeleton,
  ServiceSkeleton,
} from "../components/skeletons/PageSkeletons";
import ProtectedRoute from "./ProtectedRoute";
import DashboardSectionPage from "../pages/dashboard/DashboardSectionPage";

const Home = lazy(() => import("../pages/home"));
const Contact = lazy(() => import("../pages/contact"));
const About = lazy(() => import("../pages/about"));
const Service = lazy(() => import("../pages/service"));
const LoginPage = lazy(() => import("../pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/Auth/ForgotPasswordPage"));
const VerifyCodePage = lazy(() => import("../pages/Auth/VerifyCodePage"));
const ResetPasswordPage = lazy(() => import("../pages/Auth/ResetPasswordPage"));
const DashboardLayout = lazy(() => import("../pages/dashboard"));
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const ProjectsPage = lazy(() => import("../pages/dashboard/ProjectsPage"));
const ProjectViewPage = lazy(() => import("../pages/dashboard/ProjectViewPage"));
const UserProfilePage = lazy(() => import("../pages/dashboard/UserProfilePage"));

const withSuspense = (element: JSX.Element, fallback?: JSX.Element) => (
  <Suspense fallback={fallback ?? <HomeSkeleton />}>
    {element}
  </Suspense>
);

const withProtection = (element: JSX.Element) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

const router = createBrowserRouter([
  { 
    path: "/",
     element: <App />,
     children: [
        {
            path: "/",
            index: true,
            element: withSuspense(<Home />, <HomeSkeleton />)
        },
        {
            path: "/about",
            element: withSuspense(<About />, <AboutSkeleton />)
        },
        {
            path: "/services",
            element: withSuspense(<Service />, <ServiceSkeleton />)
        },
        {
            path: "/contact",
            element: withSuspense(<Contact />, <ContactSkeleton />)
        },
        {
            path: "/login",
            element: withSuspense(<LoginPage />, <AuthSplitSkeleton variant="login" />)
        },
        {
            path: "/register",
            element: withSuspense(<RegisterPage />, <AuthSplitSkeleton variant="register" />)
        },
        {
            path: "/dashboard",
            element: withSuspense(withProtection(<DashboardLayout />), <DashboardSkeleton />),
            children: [
                {
                    index: true,
                    element: withSuspense(<DashboardHome />, <DashboardSkeleton />)
                },
                {
                    path: "projects",
                    element: withSuspense(<ProjectsPage />, <DashboardSkeleton />)
                },
                {
                    path: "projects/:projectId",
                    element: withSuspense(<ProjectViewPage />, <ProjectViewSkeleton />)
                },
                {
                    path: "reports",
                    element: withSuspense(
                        <DashboardSectionPage
                            title="Reports"
                            description="Generate and download validation reports."
                        />,
                        <DashboardSkeleton />
                    )
                },
                {
                    path: "history",
                    element: withSuspense(
                        <DashboardSectionPage
                            title="History"
                            description="View past validation runs and status changes."
                        />,
                        <DashboardSkeleton />
                    )
                },
                {
                    path: "guidelines",
                    element: withSuspense(
                        <DashboardSectionPage
                            title="Guidelines"
                            description="Reference BCA formatting and structure rules."
                        />,
                        <DashboardSkeleton />
                    )
                },
                {
                    path: "settings",
                    element: withSuspense(
                        <DashboardSectionPage
                            title="Settings"
                            description="Manage account and system preferences."
                        />,
                        <DashboardSkeleton />
                    )
                },
                {
                    path: "notifications",
                    element: withSuspense(
                        <DashboardSectionPage
                            title="Notifications"
                            description="Review recent alerts and notification preferences."
                        />,
                        <DashboardSkeleton />
                    )
                },
                {
                    path: "user",
                    element: withSuspense(<UserProfilePage />, <DashboardSkeleton />)
                }
            ]
        },
        {
            path: "/forgot-password",
            element: withSuspense(<ForgotPasswordPage />, <AuthCardSkeleton fields={1} />)
        },
        {
            path: "/verify-code",
            element: withSuspense(<VerifyCodePage />, <AuthCardSkeleton fields={1} withSecondaryAction />)
        },
        {
            path: "/reset-password",
            element: withSuspense(<ResetPasswordPage />, <AuthCardSkeleton fields={2} />)
        }

     ]
},
]);
export default router;
