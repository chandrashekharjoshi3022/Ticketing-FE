import { lazy } from "react";
import AuthLayout from "layout/Auth";
import Loadable from "components/Loadable";

const AuthLogin = Loadable(lazy(() => import("pages/Login")));
// const AuthRegister = Loadable(lazy(() => import("pages/Signup")));

const LoginRoutes = {
  path: "/",
  element: <AuthLayout />, // keeps GuestGuard for unauthenticated
  children: [
    { path: "/", element: <AuthLogin /> },
    { path: "login", element: <AuthLogin /> },
    // { path: "register", element: <AuthRegister /> },
  ],
};

export default LoginRoutes;
