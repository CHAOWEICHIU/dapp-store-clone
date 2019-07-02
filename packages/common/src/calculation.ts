const BigJS = require("big.js");

enum RMType {
  ROUND_DOWN = 0,
  ROUND_HALF_UP = 1,
  ROUND_HALF_EVEN = 2,
  ROUND_UP = 3
}

const catchWrapper = (fn: any) => (...args: any[]) => {
  try {
    return fn(...args);
  } catch (e) {
    return undefined;
  }
};

const OperationGenerator = (op: string) => (...args: any[]) =>
  args
    .reduce((sum, val) => (sum ? sum[op](val) : BigJS(val)), undefined)
    .toFixed();

const ComparisonGenerator = (op: string) => (
  arg1: number | BigJs.Big | string,
  arg2: number | BigJs.Big | string
) => BigJS(arg1)[op](Big(arg2));

const add = catchWrapper(OperationGenerator("plus"));
const sub = catchWrapper(OperationGenerator("minus"));
const mul = catchWrapper(OperationGenerator("times"));
const div = catchWrapper(OperationGenerator("div"));
const mod = catchWrapper(OperationGenerator("mod"));

const eq = catchWrapper(ComparisonGenerator("eq"));
const gte = catchWrapper(ComparisonGenerator("gte"));
const lte = catchWrapper(ComparisonGenerator("lte"));
const gt = catchWrapper(ComparisonGenerator("gt"));
const lt = catchWrapper(ComparisonGenerator("lt"));

const round = catchWrapper(
  (
    num: number | BigJs.Big | string,
    precision: number = 10,
    type: RMType = RMType.ROUND_DOWN
  ) =>
    BigJS(num)
      .round(precision, type)
      .toFixed()
);

const toPrecision = catchWrapper(
  (num: number | BigJs.Big | string, precision: number) =>
    Big(num).toPrecision(precision)
);

module.exports = {
  add,
  sub,
  mul,
  div,
  mod,
  eq,
  lte,
  gt,
  lt,
  gte,
  round,
  toPrecision
};
