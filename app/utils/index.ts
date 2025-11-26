export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatCurrency(price: number): string {
  return `€${(price / 100).toFixed(2)}`;
}

export function splitCurrencyAmount(price: number) {
  const euros = Math.floor(price / 100);
  const cents = String(price % 100).padStart(2, "0");

  return {
    euros,
    cents,
  };
}
