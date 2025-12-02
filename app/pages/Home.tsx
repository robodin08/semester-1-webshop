import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "~/constants/products";
import { HOME_CATEGORIES } from "~/constants/categories";
import { useCart } from "~/hooks/useCart";
import { formatCurrency, getProductImage } from "~/utils";

function Home() {
  const { t } = useTranslation(["home", "common"]);

  const { searchProducts } = useCart();

  const [popularProducts, setPopularProducts] = useState<Product[]>();
  const [newProducts, setNewProducts] = useState<Product[]>();

  useEffect(() => {
    document.title = t("pageTitle.home", { ns: "common" });
  }, [t]);

  useEffect(() => {
    async function loadPopularProducts() {
      const popular = await searchProducts(
        {
          categories: ["popular"],
        },
        8
      );

      setPopularProducts(popular);
    }

    async function loadNewProducts() {
      const newP = await searchProducts(
        {
          categories: ["new"],
        },
        8
      );

      setNewProducts(newP);
    }

    loadPopularProducts();
    loadNewProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-blue-600 via-blue-700 to-red-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text- mb-4 text-5xl leading-tight font-bold sm:text-6xl">{t("hero.title")}</h1>
            <p className="mb-8 text-xl text-gray-100">{t("hero.subtitle")}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/search"
                className="rounded-lg bg-yellow-400 px-8 py-3 font-semibold text-gray-900 transition hover:bg-yellow-500"
              >
                {t("hero.shopNow")}
              </a>
              <a
                href="/search?category=new"
                className="rounded-lg border-2 border-white px-8 py-3 font-semibold transition hover:bg-white hover:text-blue-600"
              >
                {t("hero.viewNew")}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Products Section */}
      {popularProducts && popularProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("sections.popular")}</h2>
                <p className="mt-2 text-gray-600">{t("sections.popularSubtitle")}</p>
              </div>
              <a href="/search?category=popular" className="hidden text-blue-600 hover:text-blue-700 sm:block">
                {t("viewAll")} →
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {popularProducts.map((product) => (
                <a
                  key={product.id}
                  href={`/p/${product.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-100">
                    <img
                      className="h-full w-full object-contain p-4 transition group-hover:scale-105"
                      src={getProductImage(Number(product.id), 0, "big")}
                      alt={product.name}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-lg font-bold text-red-600">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <a
              href="/search?category=popular"
              className="mt-8 block text-center text-blue-600 hover:text-blue-700 sm:hidden"
            >
              {t("viewAll")} →
            </a>
          </div>
        </section>
      )}

      {/* New Products Section */}
      {newProducts && newProducts.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("sections.new")}</h2>
                <p className="mt-2 text-gray-600">{t("sections.newSubtitle")}</p>
              </div>
              <a href="/search?category=new" className="hidden text-blue-600 hover:text-blue-700 sm:block">
                {t("viewAll")} →
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
              {newProducts.map((product) => (
                <a
                  key={product.id}
                  href={`/p/${product.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="relative">
                    <div className="aspect-square w-full overflow-hidden bg-gray-100">
                      <img
                        className="h-full w-full object-contain p-4 transition group-hover:scale-105"
                        src={getProductImage(Number(product.id), 0, "big")}
                        alt={product.name}
                      />
                    </div>
                    <span className="absolute top-2 right-2 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      {t("badge.new")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
                      {product.name}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-lg font-bold text-red-600">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            <a
              href="/search?category=new"
              className="mt-8 block text-center text-blue-600 hover:text-blue-700 sm:hidden"
            >
              {t("viewAll")} →
            </a>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">{t("sections.categories")}</h2>
            <p className="mt-2 text-gray-400">{t("sections.categoriesSubtitle")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {HOME_CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`/search?category=${category.id}`}
                className="flex flex-col items-center rounded-lg bg-gray-800 p-6 transition hover:bg-gray-700"
              >
                <span className="mb-3 text-4xl">{category.icon}</span>
                <span className="text-sm font-semibold">{category.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
