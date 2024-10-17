import { createBrowserRouter } from "react-router-dom";
import { Invoices } from "@/pages/Invoices/Invoices";
import { AppLayout } from "@/_layouts/AppLayout/AppLayout";

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
