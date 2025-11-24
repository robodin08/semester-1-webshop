import { useEffect } from "react";
import { Link } from "react-router";

function Home() {
  useEffect(() => {
    document.title = `Webshoppy`;
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-4xl font-bold text-gray-900">Home Page</h1>
      <p className="mb-6 text-lg text-gray-700">Welcome to our webshop!</p>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/p/_/0" className="text-blue-600 hover:text-blue-800 hover:underline">
              Product 0
            </Link>
          </li>
          <li>
            <Link to="/p/_/1" className="text-blue-600 hover:text-blue-800 hover:underline">
              Product 1
            </Link>
          </li>
          <li>
            <Link to="/p/_/2" className="text-blue-600 hover:text-blue-800 hover:underline">
              Product 2
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
