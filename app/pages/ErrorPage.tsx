import { Link, useRouteError, isRouteErrorResponse } from "react-router";

function ErrorPage() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">{errorStatus}</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">Error</h2>
        <p className="mb-8 text-gray-600">{errorMessage}</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
