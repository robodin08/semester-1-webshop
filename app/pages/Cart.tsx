import { useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { IoAdd, IoRemove, IoTrash, IoCheckmarkCircle, IoInformationCircle } from "react-icons/io5";
import { useCart } from "~/hooks/useCart";
import { formatCurrency } from "~/utils";
import { DELIVERY_COST, FREE_DELIVERY_THRESHOLD } from "~/constants/delivery";

function Cart() {
  const { loaded, cart, total, totalQuantity, incrementItemQuantity, decrementItemQuantity, setItemQuantity } =
    useCart();
  const { t } = useTranslation(["cart", "common"]);

  useEffect(() => {
    document.title = `${t("pageTitle.cart", { ns: "common" })} | ${t("pageTitle.home", { ns: "common" })}`;
  }, [t]);

  if (!loaded) return null;

  const cartItems = Object.values(cart);
  const isEmpty = cartItems.length === 0;

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">{t("emptyCart")}</h1>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const isFreeDelivery = total >= FREE_DELIVERY_THRESHOLD;
  const deliveryCost = isFreeDelivery ? 0 : DELIVERY_COST;
  const finalTotal = total + deliveryCost;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{t("shoppingCart")}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;
              const imageUrl = `/assets/products/${item.id}/0_big.png`;

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row"
                >
                  {/* Product Image */}
                  <Link to={`/p/${item.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <div className="aspect-square w-full overflow-hidden rounded-md sm:h-32 sm:w-32">
                      <img src={imageUrl} className="h-full w-full object-contain" />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to={`/p/${item.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
                      <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-gray-300 bg-gray-50 shadow-sm">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                setItemQuantity(item, 0);
                              } else {
                                decrementItemQuantity(item);
                              }
                            }}
                            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center hover:bg-gray-100"
                          >
                            {item.quantity === 1 ? (
                              <IoTrash className="h-4 w-4 text-gray-700" />
                            ) : (
                              <IoRemove className="h-4 w-4 text-gray-700" />
                            )}
                          </button>
                          <span className="flex h-8 w-12 shrink-0 items-center justify-center border-x border-gray-300 bg-white text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementItemQuantity(item)}
                            disabled={item.quantity >= (item.maxQuantity ?? 999)}
                            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-50"
                          >
                            <IoAdd className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons - Fixed width container to prevent shifting */}
                      <div className="hidden shrink-0 sm:flex sm:items-center sm:gap-3">
                        <button
                          onClick={() => setItemQuantity(item, 0)}
                          className="flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <IoTrash className="h-4 w-4" />
                          {t("delete")}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Item Total - Positioned for responsive */}
                  <div className="flex shrink-0 items-start justify-between border-t border-gray-200 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                    <span className="text-sm font-medium text-gray-700 sm:hidden">{t("subtotal")}:</span>
                    <p className="text-lg font-semibold text-gray-900">{formatCurrency(itemTotal)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {t("subtotal")} ({t("items", { count: totalQuantity })})
            </h2>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base text-gray-900">
                <span>{t("subtotal")}</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="flex justify-between text-base text-gray-900">
                <span>{t("delivery")}</span>
                <span className={isFreeDelivery ? "font-semibold text-green-600" : ""}>
                  {isFreeDelivery ? t("free") : formatCurrency(deliveryCost)}
                </span>
              </div>

              {isFreeDelivery && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                  <IoCheckmarkCircle className="h-5 w-5 shrink-0" />
                  <span>{t("freeDeliveryApplied")}</span>
                </div>
              )}

              {!isFreeDelivery && total > 0 && (
                <div className="flex items-center gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
                  <IoInformationCircle className="h-5 w-5 shrink-0" />
                  <span>{t("freeDeliveryHint", { amount: formatCurrency(FREE_DELIVERY_THRESHOLD - total) })}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-semibold text-gray-900">
                <span>{t("total")}</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <button
              className="mt-6 w-full cursor-pointer rounded-md bg-yellow-400 px-6 py-3 text-base font-medium text-gray-900 hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none"
              onClick={() => alert("Checkout functionality not implemented yet")}
            >
              {t("proceedToCheckout")}
            </button>

            <Link to="/" className="mt-3 block text-center text-sm text-blue-600 hover:text-blue-800 hover:underline">
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
