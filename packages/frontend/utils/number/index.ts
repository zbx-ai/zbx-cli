// 转换为数字，并判断 NaN
export const toNumber = (value: string): number => {
  const num = Number(value.replace(/[^0-9.]/gi, ""));
  return Number.isNaN(num) ? 0 : num;
};

// 去数组中数字的中位数
export const median = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? (sorted[mid] ?? 0)
    : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
};

// 千分位分隔符
export const applyThousandSeparator = (
  value: string,
  thousandSeparator: boolean | string = ",",
): string => {
  if (thousandSeparator === false) {
    return value;
  }
  const reg = /\B(?=(\d{3})+(?!\d))/g;
  if (thousandSeparator === true) {
    return value.replace(reg, ",");
  }
  return value.replace(reg, thousandSeparator);
};

// 简单四舍五入并保留小数点后位数, 避免toFixed()函数的浮点数精度问题
export const toRoundFixed = (num: number, scale: number): number => {
  if (num && scale) {
    return Math.round(num * 10 ** scale) / 10 ** scale;
  }
  return num;
};

export const parseNumber = (val: string): number => {
  const value = parseFloat(val);
  return Number.isNaN(value) ? 0 : value;
};

/**
 * 是否真实的是数字
 * @param v
 */
export function isRealNumber(v: unknown): v is number {
  if (typeof v === "number") {
    return !Number.isNaN(v);
  }
  if (typeof v === "string") {
    const num = parseFloat(v);
    return !Number.isNaN(num) && /^-?\d*\.?\d+$/.test(v);
  }
  return false;
}

/**
 * @ignore
 * Determines whether between is
 * @param value
 * @param start
 * @param end
 * @returns true if between
 */
export function isBetween(value: number, start: number, end: number): boolean {
  const min = Math.min(start, end);
  const max = Math.max(start, end);

  return value >= min && value <= max;
}

export const formatPercentage = (num?: number): string => {
  if (isRealNumber(num)) {
    return `${toRoundFixed(num, 2)}%`;
  }
  return "0%";
};

export function roundUpToNDecimalPlaces(
  value: number,
  decimals: number,
): number {
  const factor = 10 ** decimals;
  return Math.ceil(value * factor) / factor;
}

// 计算比例并调整使总和为100
export function adjustRatiosToSum100(values: number[]): number[] {
  // 先计算原始比例
  const ratios = values.map((v) => v * 100);

  // 四舍五入到两位小数
  const rounded = ratios.map((r) => Math.round(r * 100) / 100);

  // 计算差值
  const sum = rounded.reduce((a, b) => a + b, 0);
  const diff = 100 - sum;

  if (Math.abs(diff) < 0.01) return rounded;

  // 找出舍入误差最大的项进行调整
  const errors = ratios
    .map((r, i) => ({
      index: i,
      error: r - (rounded[i] ?? 0),
    }))
    .sort((a, b) => Math.abs(b.error) - Math.abs(a.error));

  // 分配差值到误差最大的项
  const firstError = errors[0];
  if (firstError) {
    const { index } = firstError;
    const currentVal = rounded[index];
    if (typeof currentVal === "number") {
      rounded[index] = Math.round((currentVal + diff) * 100) / 100;
    }
  }

  return rounded;
}
