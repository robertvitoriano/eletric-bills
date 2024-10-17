import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "./_layouts/AppLayout/AppLayout";
import { Invoices } from "./pages/invoices/Invoices";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Invoices />,
      },

      {
        path: "/invoices/:year",
        element: <Invoices />,
      },
    ],
  },
]);
