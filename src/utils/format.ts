
/**
 * Return formatted number rounding up to 2 decimal places
 * @constructor
 * @param {number} num - number to format
 */
export const formatNumber = (num: number) => Number(num.toFixed(2));
/**
 * Return formatted date with type format YYYY-MM-DD
 * @constructor
 * @param {string} date - current date.
 */
// export const formatDate = () => dayjs().format("YYYY-MM-DD HH ");
// /**
//  * Return number week of a month.
//  * @constructor
//  * @param {string} date - current date.
//  */
// export const weekOfMonth = (date: string) => {
//   const num = dayjs(date).startOf("month").day();
//   const c = num === 0 ? 7 : num;
//   return Math.ceil((Number(dayjs(date).format("DD")) + c) / 7);
// };
