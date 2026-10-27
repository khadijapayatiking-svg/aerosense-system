import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AlertsPage } from "@/features/alerts/AlertsPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { FieldsPage } from "@/features/fields/FieldsPage";
import { FlightsPage } from "@/features/flights/FlightsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "fields", element: <FieldsPage /> },
          { path: "flights", element: <FlightsPage /> },
          { path: "alerts", element: <AlertsPage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);
