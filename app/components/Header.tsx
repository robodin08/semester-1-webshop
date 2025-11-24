import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoSearch, IoPersonOutline, IoCartOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router";

import { useCart } from "~/hooks/useCart";

import LanguageMenu from "~/components/LanguageMenu";

export default function Header() {
  const { t } = useTranslation("header");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { totalQuantity } = useCart();

  function handleSearch() {
    const trimmed = search.trim();
    if (!trimmed) return;

    console.log("Searching for:", trimmed);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <header className="w-full border-b border-gray-200/80 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 select-none">
          Web<span className="text-gray-800">shoppy</span>
        </Link>

        {/* Search */}
        <div className="relative hidden w-full max-w-xl flex-1 sm:flex">
          <div className="relative w-full">
            <IoSearch size={20} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("search.placeholder.desktop")}
              className="w-full rounded-full border border-gray-300 bg-gray-50/50 py-2.5 pr-4 pl-12 text-sm text-gray-700 placeholder-gray-400 shadow-sm duration-200 outline-none hover:bg-gray-50 focus:border-blue-500 focus:bg-white focus:shadow-md focus:ring-4 focus:ring-blue-100"
            />
            <button
              onClick={handleSearch}
              className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-linear-to-r from-blue-600 to-blue-700 px-5 py-1.5 text-sm font-medium text-white shadow-md hover:shadow-lg"
            >
              <span className="inline-block w-12 text-center">{t("search.label")}</span>
            </button>
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2">
          <LanguageMenu />

          <button className="cursor-pointer rounded-full p-2.5 hover:bg-gray-100">
            <IoPersonOutline size={22} className="text-gray-600" />
          </button>

          <button className="relative cursor-pointer rounded-full p-2.5 hover:bg-gray-100">
            <IoCartOutline size={22} className="text-gray-600" />

            {totalQuantity !== 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-red-600 text-[10px] font-bold text-white shadow-lg ring-2 shadow-red-500/40 ring-white">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="block border-t border-gray-200/80 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
        <div className="relative flex">
          <div className="relative w-full">
            <IoSearch size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("search.placeholder.mobile")}
              className="w-full rounded-full border border-gray-300 bg-gray-50/50 py-2.5 pr-20 pl-11 text-sm text-gray-700 placeholder-gray-400 shadow-sm outline-none focus:border-blue-500 focus:bg-white focus:shadow-md focus:ring-4 focus:ring-blue-100"
            />
            <button
              onClick={handleSearch}
              className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full bg-linear-to-r from-blue-600 to-blue-700 px-4 py-1.5 text-sm font-medium text-white shadow-md hover:shadow-lg"
            >
              <IoSearch size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
