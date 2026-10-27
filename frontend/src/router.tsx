import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { NotFoundPage } from "@/pages/NotFoundPage";

function renderPlaceholder(title: string, description: string) {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-surface-inverse">
        {title}
      </h1>
      <p className="mt-2 max-w-prose text-sm text-earth-600">{description}</p>
      <p className="mt-6 rounded-lg border border-dashed border-border-strong bg-surface px-4 py-6 text-sm text-earth-600">
        Coming in a later step.
      </p>
    </section>
  );
}

function renderLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <section className="w-full max-w-sm rounded-xl border border-border-subtle bg-surface p-6 shadow-sm">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-surface-inverse">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-earth-600">
          Authentication comes in a later step.
        </p>
      </section>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: renderPlaceholder(
          "Dashboard",
          "An overview of fields, flights, and alerts will appear here.",
        ),
      },
      {
        path: "fields",
        element: renderPlaceholder(
          "Fields",
          "Field monitoring and crop health details will appear here.",
        ),
      },
      {
        path: "flights",
        element: renderPlaceholder(
          "Flights",
          "Drone flight plans and capture history will appear here.",
        ),
      },
      {
        path: "alerts",
        element: renderPlaceholder(
          "Alerts",
          "Scouting alerts and field issues will appear here.",
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/login", element: renderLogin() },
]);
