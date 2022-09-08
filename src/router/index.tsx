import type { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import EmailVerificationPage from "../pages/emailverification.page";
import ForgotPasswordPage from "../pages/forgotpassword.page";
import HomePage from "../pages/home.page";
import LoginPage from "../pages/login.page";
import ProfilePage from "../pages/profile.page";
import RegisterPage from "../pages/register.page";
import ResetPasswordPage from "../pages/resetpassword.page";

const authRoutes: RouteObject = {
  path: "*",
  children: [
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
    {
      path: "verifyemail",
      element: <EmailVerificationPage />,
      children: [
        {
          path: ":verificationCode",
          element: <EmailVerificationPage />,
        },
      ],
    },
    {
      path: "forgotpassword",
      element: <ForgotPasswordPage />,
    },
    {
      path: "resetpassword/:resetCode",
      element: <ResetPasswordPage />,
    },
  ],
};

const normalRoutes: RouteObject = {
  path: "*",
  element: <Layout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "profile",
      children: [
        {
          path: "",
          element: <ProfilePage />,
        },
      ],
    },
  ],
};

const routes: RouteObject[] = [authRoutes, normalRoutes];

export default routes;
