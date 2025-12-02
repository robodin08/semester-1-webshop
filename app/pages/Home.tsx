import { useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation("common");

  useEffect(() => {
    document.title = t("pageTitle.home");
  }, [t]);

  return (
    <>
      <h1 className="mb-4 text-4xl font-bold text-gray-900">Home Page</h1>
      <p className="mb-6 text-lg text-gray-700">Welcome to our webshop!</p>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/p/0" className="text-blue-600 hover:text-blue-800 hover:underline">
              Phantom Headset
            </Link>
          </li>
          <li>
            <Link to="/p/1" className="text-blue-600 hover:text-blue-800 hover:underline">
              Viper Gaming Mouse
            </Link>
          </li>
          <li>
            <Link to="/p/2" className="text-blue-600 hover:text-blue-800 hover:underline">
              Hawk Eye Monitor
            </Link>
          </li>
          <li>
            <Link to="/p/3" className="text-blue-600 hover:text-blue-800 hover:underline">
              Expensive Gaming Mouse
            </Link>
          </li>
          <li>
            <Link to="/p/4" className="text-blue-600 hover:text-blue-800 hover:underline">
              Mega Monitor
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Home;
