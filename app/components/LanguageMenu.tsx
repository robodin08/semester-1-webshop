import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { IoCheckmarkOutline, IoGlobeOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

import { languages } from "~/constants/languages";

export default function LanguageMenu() {
  const { i18n } = useTranslation();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="cursor-pointer rounded-full p-2.5 hover:bg-gray-100">
        <IoGlobeOutline size={22} className="text-gray-600" />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-lg data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {Object.entries(languages).map(([lng, name]) => (
            <MenuItem key={lng}>
              {() => (
                <button
                  onClick={() => i18n.changeLanguage(lng)}
                  disabled={i18n.resolvedLanguage === lng}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                    i18n.resolvedLanguage === lng
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  } ${i18n.resolvedLanguage === lng ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span>{name}</span>
                  {i18n.resolvedLanguage === lng && <IoCheckmarkOutline className="text-blue-600" />}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
}
