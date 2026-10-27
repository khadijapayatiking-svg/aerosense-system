import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg py-12">
      <p className="text-sm font-semibold tracking-wide text-canopy-700 uppercase">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-surface-inverse">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-earth-600">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md bg-canopy-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-canopy-800 focus-visible:ring-2 focus-visible:ring-canopy-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted focus-visible:outline-none"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
