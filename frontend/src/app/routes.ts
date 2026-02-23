import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import CarRentals from "./pages/CarRentals";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/hotels",
    Component: Hotels,
  },
  {
    path: "/location-voiture",
    Component: CarRentals,
  },
  {
    path: "/connexion",
    Component: Login,
  },
  {
    path: "/inscription",
    Component: Register,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
