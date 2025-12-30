import { applyThousandSeparator, toRoundFixed } from "./index.js";
export type NumberFormationProps = {
  /**
   * @description 语言
   */
  language?: "zh-CN" | "en-US" | string;

  /**
   * @description 是否自动做数据单位换算
   */
  autoFormat?: boolean;

  /**
   * @description 自动换算时, 最小转换位数
   */
  formatScale?: number;

  /**
   * @description 小数点位数
   */
  decimalScale?: number;

  /**
   * @description 是否使用千分位分隔符
   */
  thousandSeparator?: boolean | string;

  /**
   * @description 前缀
   */
  prefix?: string;

  /**
   * @description 后缀
   */
  suffix?: string;

  /**
   * @description 小数点后是0 是否选择隐藏
   */
  hiddenZero?: boolean;
};

export type Formation = {
  minus?: string;
  intNumStr: string;
  floatNum: string;
  prefix?: string;
  suffix?: string;
  unit?: string;
};

/**
 * 格式化
 * @param value
 * @param options
 *
 * @return Formation
 */
export function formation(
  value: number,
  options: NumberFormationProps = {},
): Formation {
  const {
    autoFormat = true,
    thousandSeparator = true,
    hiddenZero = true,
    prefix = "",
    suffix = "",
    formatScale = 4,
    decimalScale = 2,
    language = "en-US",
  } = options;

  const minus = value < 0 ? "-" : "";
  const _value = Math.abs(value);

  const valueStr = toRoundFixed(_value, decimalScale).toString();
  const intVal = valueStr.split(".")[0];

  let unit = "";
  let newValue = toRoundFixed(_value, decimalScale);

  if (language === "zh-CN") {
    if (autoFormat && intVal) {
      if (intVal.length >= formatScale + 4) {
        unit = "亿";
        newValue = toRoundFixed(newValue / 100000000, decimalScale);
      } else if (intVal.length >= formatScale) {
        unit = "万";
        newValue = toRoundFixed(newValue / 10000, decimalScale);
      }
    }
  } else {
    if (autoFormat && intVal) {
      if (intVal.length >= formatScale + 6) {
        unit = "B";
        newValue = toRoundFixed(_value / 1000000000, decimalScale);
      } else if (intVal.length >= formatScale + 3) {
        unit = "M";
        newValue = toRoundFixed(_value / 1000000, decimalScale);
      } else if (intVal.length >= formatScale) {
        unit = "K";
        newValue = toRoundFixed(_value / 1000, decimalScale);
      }
    }
  }

  const arrValue = newValue.toString().split(".");
  const intNum = arrValue[0] || "";
  let floatNum = arrValue[1] || "";
  const intNumStr = applyThousandSeparator(intNum, thousandSeparator);
  // 补零
  if (!hiddenZero && !floatNum) {
    floatNum = new Array(decimalScale).fill(0).join("");
  }

  return {
    minus,
    prefix,
    intNumStr,
    floatNum,
    unit,
    suffix,
  };
}

/**
 * 格式化数字字符串
 * @param value
 * @param options
 * @return string
 */
export function formatNumber(
  value: number,
  options?: NumberFormationProps,
): string {
  const { minus, prefix, intNumStr, floatNum, unit, suffix } = formation(
    value,
    options,
  );
  const floatNumStr = floatNum ? `.${floatNum}` : "";
  return `${minus}${prefix}${intNumStr}${floatNumStr}${unit}${suffix}`;
}

/**
 * 按单位还原数字
 * @param value
 * @param unit
 */
export function unFormatNumber(
  value: number,
  unit: "K" | "M" | "G" | "T" | string,
): number {
  switch (unit) {
    case "K":
      return value * 1000;
    case "M":
      return value * 1000000;
    case "G":
      return value * 1000000000;
    case "T":
      return value * 1000000000000;
    default:
      return value;
  }
}
