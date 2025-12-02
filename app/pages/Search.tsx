import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { IoCloseOutline, IoFunnel } from "react-icons/io5";
import { useCart } from "~/hooks/useCart";
import { ProductCard } from "~/components/ProductCard";
import type { Product } from "~/constants/products";
import type { SortOption } from "~/contexts/CartContext";
import { FILTER_CATEGORIES } from "~/constants/categories";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation(["search", "common"]);
  const { searchProducts } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("max") || "");
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get("s") as SortOption) || "relevance");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? categoryParam.split(",") : []);

  useEffect(() => {
    document.title = query
      ? `${t("pageTitle.searchWithQuery", { ns: "common", query })} | ${t("pageTitle.home", { ns: "common" })}`
      : `${t("pageTitle.search", { ns: "common", query })} | ${t("pageTitle.home", { ns: "common" })}`;
  }, [query, selectedCategories, t]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    if (sortBy !== "relevance") params.set("s", sortBy);
    if (selectedCategories.length > 0) params.set("category", selectedCategories.join(","));

    setSearchParams(params, { replace: true });
  }, [minPrice, maxPrice, sortBy, selectedCategories, setSearchParams]);

  useEffect(() => {
    async function loadProducts() {
      const min = minPrice ? parseFloat(minPrice) * 100 : undefined;
      const max = maxPrice ? parseFloat(maxPrice) * 100 : undefined;

      const results = await searchProducts({
        query: query || undefined,
        minPrice: min,
        maxPrice: max,
        sortBy: sortBy,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      });

      setProducts(results);
      setLoaded(true);
    }

    loadProducts();
  }, [loaded, searchProducts, query, minPrice, maxPrice, sortBy, selectedCategories]);

  function handleClearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setSortBy("relevance");
    setSelectedCategories([]);

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    setSearchParams(params, { replace: true });
  }

  function toggleCategory(category: string) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  const hasActiveFilters =
    minPrice !== "" || maxPrice !== "" || sortBy !== "relevance" || selectedCategories.length > 0;

  if (!loaded) return null;

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        {query ? (
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("searchFor")}: "{query}"
          </h1>
        ) : (
          <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">{t("searchResults")}</h1>
        )}
        <p className="text-base text-gray-600">{t("results", { count: products.length })}</p>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{t("filters")}</h2>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {t("clearFilters")}
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-gray-900">{t("categories")}</h3>
              <div className="space-y-2">
                {FILTER_CATEGORIES.map((cat) => (
                  <label key={cat.id} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-gray-900">{t("priceRange")}</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="min-price" className="mb-1 block text-sm text-gray-600">
                    {t("minPrice")}
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="€0"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="mb-1 block text-sm text-gray-600">
                    {t("maxPrice")}
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="€999"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">{t("sortBy")}</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="relevance">{t("sortRelevance")}</option>
                <option value="price-low">{t("sortPriceLowToHigh")}</option>
                <option value="price-high">{t("sortPriceHighToLow")}</option>
                <option value="name-asc">{t("sortNameAZ")}</option>
                <option value="name-desc">{t("sortNameZA")}</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Filter Button */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <IoFunnel size={18} />
              {t("filters")}
              {hasActiveFilters && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">•</span>}
            </button>

            {/* Mobile Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="relevance">{t("sortRelevance")}</option>
              <option value="price-low">{t("sortPriceLowToHigh")}</option>
              <option value="price-high">{t("sortPriceHighToLow")}</option>
              <option value="name-asc">{t("sortNameAZ")}</option>
              <option value="name-desc">{t("sortNameZA")}</option>
            </select>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center">
              <p className="mb-2 text-xl font-semibold text-gray-900">{t("noResults")}</p>
              <p className="text-gray-600">{t("noResultsDescription")}</p>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="bg-opacity-50 fixed inset-0 bg-black" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed inset-y-0 right-0 w-full bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
                <h2 className="text-lg font-semibold text-gray-900">{t("filters")}</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-gray-900">{t("categories")}</h3>
                  <div className="space-y-2">
                    {FILTER_CATEGORIES.map((cat) => (
                      <label key={cat.id} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="mb-3 font-medium text-gray-900">{t("priceRange")}</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="mobile-min-price" className="mb-1 block text-sm text-gray-600">
                        {t("minPrice")}
                      </label>
                      <input
                        id="mobile-min-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="€0"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="mobile-max-price" className="mb-1 block text-sm text-gray-600">
                        {t("maxPrice")}
                      </label>
                      <input
                        id="mobile-max-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="€999"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={handleClearFilters}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {t("clearFilters")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Search;
