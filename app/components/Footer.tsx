import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");
  return (
    <footer className="border-t border-gray-200 bg-white py-4">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 lg:px-8">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
