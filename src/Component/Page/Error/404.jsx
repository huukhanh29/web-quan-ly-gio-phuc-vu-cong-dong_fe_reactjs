import { Link } from 'react-router-dom';

export default function Page404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            404 Not Found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
          We can't find that page
          </p>
        </div>
        <div className="flex justify-center">
          <Link to="/" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
