export function formatMoney(amount: number): string {
  return "₦" + new Intl.NumberFormat("en-NG").format(amount);
}

export function commaSeparateNumber(num: number): string {
  return new Intl.NumberFormat("en-NG").format(num);
}

export function divmod(numerator: number, denumerator: number): number[] {
  return [Math.floor(numerator / denumerator), numerator % denumerator];
}
