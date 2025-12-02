import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IoCartOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";

import type { Product as ProductType } from "~/constants/products";

import { useCart } from "~/hooks/useCart";
import { splitCurrencyAmount } from "~/utils";

function Product() {
  const { pid } = useParams<{ pid: string }>();
  const { t } = useTranslation(["product", "common"]);
  const { loaded: cartLoaded, cart, getProductById, incrementItemQuantity } = useCart();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [image, setImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoaded(false);
      if (!pid) {
        setLoaded(true);
        return;
      }

      const p = cart[pid] || (await getProductById(pid));

      if (p) {
        setProduct(p);
        document.title = `${t("pageTitle.product", { ns: "common", name: p.name })} | ${t("pageTitle.home", { ns: "common" })}`;
      }

      setLoaded(true);
    }

    fetchProduct();
  }, [cartLoaded, t]);

  function handlePreviousImage() {
    if (!product) return;
    setImage((prev) => (prev === 0 ? product.images - 1 : prev - 1));
  }

  function handleNextImage() {
    if (!product) return;
    setImage((prev) => (prev === product.images - 1 ? 0 : prev + 1));
  }

  if (!loaded) return null;
  if (!product) throw new Error(`Product not found`);

  const { euros, cents } = splitCurrencyAmount(product.price);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl lg:text-4xl">{product.name}</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div className="flex flex-col">
          {/* Main Image */}
          <div
            className="flex aspect-square cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl"
            onClick={() => setLightboxOpen(true)}
          >
            <div className="h-full w-full p-5" id="image-container">
              <img src={`/assets/products/${product.id}/${image}_big.png`} className="h-full w-full object-contain" />
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="mt-4 flex gap-2">
            {Array.from({ length: product.images }).map((_, index) => (
              <button
                key={index}
                onClick={() => setImage(index)}
                className={`flex aspect-square flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg border p-1 transition-colors ${
                  image === index ? "border-2 border-blue-500" : "border border-gray-300 hover:border-gray-400"
                }`}
              >
                <img
                  src={`/assets/products/${product.id}/${index}_small.png`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col">
          <div className="mb-4 font-bold text-red-600">
            <span className="text-5xl leading-none sm:text-6xl">
              {euros}
              {Number(cents) !== 0 && <sup className="text-3xl sm:text-4xl">{cents}</sup>}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">{t("description")}</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {pid && cart[pid] ? (
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:outline-none sm:w-auto">
              <IoCheckmarkOutline size={20} />
              {t("inShoppingCart")}
            </button>
          ) : (
            <button
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
              onClick={() => incrementItemQuantity(product)}
            >
              <IoCartOutline size={20} />
              {t("inShoppingCart")}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="bg-opacity-95 fixed inset-0 z-50 flex items-center justify-center bg-white"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 z-50 cursor-pointer rounded-full bg-gray-200 p-2 text-gray-800 transition-all hover:bg-gray-300"
            onClick={() => setLightboxOpen(false)}
          >
            <IoCloseOutline size={32} />
          </button>

          {/* Previous Button */}
          {product.images > 1 && (
            <button
              className="absolute left-4 z-50 cursor-pointer rounded-full bg-gray-200 p-2 text-gray-800 transition-all hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handlePreviousImage();
              }}
            >
              <IoChevronBackOutline size={32} />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative flex h-full w-full items-center justify-center p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`/assets/products/${product.id}/${image}_big.png`}
              className="h-5/6 max-h-full max-w-full object-contain"
            />
          </div>

          {/* Next Button */}
          {product.images > 1 && (
            <button
              className="absolute right-4 z-50 cursor-pointer rounded-full bg-gray-200 p-2 text-gray-800 transition-all hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              <IoChevronForwardOutline size={32} />
            </button>
          )}

          {/* Thumbnail Navigation */}
          {product.images > 1 && (
            <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2">
              {Array.from({ length: product.images }).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(index);
                  }}
                  className={`h-16 w-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                    image === index ? "border-blue-500" : "border-gray-300 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`/assets/products/${product.id}/${index}_small.png`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Product;
