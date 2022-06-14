export function formatMoney(amount: number) {
  return "₦" + new Intl.NumberFormat("en-NG").format(amount);
}
