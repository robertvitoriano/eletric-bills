import { createBrowserRouter } from "react-router-dom";
import { Invoices } from "@/pages/Invoices/Invoices";
import { AppLayout } from "@/_layouts/AppLayout/AppLayout";
import { Dashboard } from "@/pages/Dashobard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },

      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
