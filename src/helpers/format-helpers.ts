import dayjs, { Dayjs } from "dayjs";

export function formatMoney(amount: number): string {
  return "₦" + new Intl.NumberFormat("en-NG").format(amount);
}

// export function formatMoney(amount: number): string {
//   return new Intl.NumberFormat("en-NG", {
//     style: "currency",
//     currency: "NGN",
//   }).format(amount);
// }

export function commaSeparateNumber(num: number): string {
  return new Intl.NumberFormat("en-NG").format(num);
}

export function divmod(numerator: number, denumerator: number): number[] {
  return [Math.floor(numerator / denumerator), numerator % denumerator];
}

/**
 * takes a raw date string received from the backend and converts it to a displayable string
 */
export function formatRawDate(dateString: string): string {
  if (dateString === "") return "";
  return dayjs(dateString).format("DD/MM/YYYY");
}

export const capitalizeSentence = (str: string): string =>
  str.replace(
    /(^\w|\s\w)(\S*)/g,
    (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
  );

export function dateStringToDayjs(
  dateString: string,
  format: "numeric" | "human" = "numeric"
) {
  if (format === "human") {
    const options = {
      year: "numeric" as "numeric",
      month: "long" as "long",
      day: "numeric" as "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  return dayjs(dateString).format("DD/MM/YYYY");
}

export function dayJsToDateString(date: Dayjs) {
  return date.format("YYYY-MM-DD");
}
