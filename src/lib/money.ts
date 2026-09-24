/** Format amount as Nigerian Naira by default */
export function formatPrice(
  amount: number,
  currency: string = "NGN"
): string {
  const code = (currency || "NGN").toUpperCase();
  try {
    return new Intl.NumberFormat(code === "NGN" ? "en-NG" : "en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: code === "NGN" ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    if (code === "NGN") return `₦${amount.toLocaleString("en-NG")}`;
    return `$${amount.toFixed(2)}`;
  }
}
