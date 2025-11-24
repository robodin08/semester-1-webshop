import { type RouteObject } from "react-router";

import Layout from "~/components/Layout";
import Home from "~/pages/Home";
import Product from "~/pages/Product";
import NotFound from "~/pages/NotFound";
import ErrorPage from "~/pages/ErrorPage";

import { productLoader } from "~/loaders/productLoader";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "p/:pname/:pid",
        element: <Product />,
        loader: productLoader,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
