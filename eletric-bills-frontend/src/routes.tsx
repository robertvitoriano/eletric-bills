import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./_layouts/AppLayout/AppLayout";
import { Bills } from "./pages/Bills/Bills";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Bills/>,
      },

      {
        path: "/bills/:year",
        element: <Bills/>,
      },


    ],
  }
]);
